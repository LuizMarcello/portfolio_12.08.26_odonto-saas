import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import modal

app_name = "odonto-saas-backend"
image = modal.Image.debian_slim().pip_install(
    "fastapi",
    "uvicorn",
    "python-multipart",
    "cohere",
    "torch",
    "transformers",
    "accelerate"
)

modal_app = modal.App(app_name)
web_app = FastAPI(title="Odonto SaaS AI Backend")

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@web_app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        transcription_text = "Paciente relatou dor aguda no dente molar inferior direito ao ingerir líquidos frios há três dias."
        
        cohere_key = os.getenv("COHERE_API_KEY")
        summary_text = ""
        
        if cohere_key:
            import cohere
            co = cohere.Client(api_key=cohere_key)
            response = co.generate(
                model="command-xlarge-nightly",
                prompt=f"A partir da transcrição da consulta odontológica abaixo, extraia os principais sintomas e crie uma ficha clínica estruturada para anamnese:\n\n{transcription_text}",
                max_tokens=150
            )
            summary_text = response.generations[0].text.strip()
        else:
            summary_text = f"Resumo Sintomático: Dor sob estímulo térmico (frio) no dente molar inferior direito."

        return {
            "transcription": transcription_text,
            "summary": summary_text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@modal_app.function(
    image=image,
    gpu="any",
    secrets=[modal.Secret.from_name("cohere-api-key")]
)
@modal.asgi_app()
def fastapi_app():
    return web_app
