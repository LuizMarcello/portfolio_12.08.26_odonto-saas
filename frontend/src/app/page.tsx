import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  Mic, 
  TrendingUp, 
  ShieldCheck, 
  Star, 
  CheckCircle2 
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 font-sans selection:bg-teal-500 selection:text-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="OdontoPRO Logo" 
              width={140} 
              height={36} 
              className="h-9 w-auto object-contain"
            />
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600">
            <a href="#features" className="transition hover:text-teal-600">Recursos</a>
            <a href="#professionals" className="transition hover:text-teal-600">Profissionais</a>
            <a href="#about" className="transition hover:text-teal-600">Sobre</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link 
              href="/auth/sign-in" 
              className="text-sm font-semibold text-zinc-700 hover:text-teal-600 transition px-3 py-2"
            >
              Entrar
            </Link>
            <Link 
              href="/auth/sign-up" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-teal-600 px-4 text-sm font-semibold text-white shadow transition hover:bg-teal-700"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-white py-16 lg:py-24">
        <div className="container mx-auto grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 px-4 sm:px-6 lg:px-8 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
              <SparklesIcon className="h-4 w-4 text-teal-600" />
              Gestão inteligente de consultórios
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
              A evolução digital da sua <span className="text-teal-600">Clínica Odontológica</span>
            </h1>
            <p className="max-w-2xl mx-auto lg:mx-0 text-lg text-zinc-600 leading-relaxed">
              Simplifique o agendamento de consultas, automatize prontuários com assistente de voz IA e gerencie sua clínica com a plataforma odontológica mais moderna do mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/clinica/sorriso-perfeito/agendar" 
                className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-900 px-6 font-bold text-white shadow-lg transition hover:bg-zinc-800"
              >
                Testar Agendamento Público
              </Link>
              <Link 
                href="/auth/sign-up" 
                className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-200 bg-white px-6 font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              >
                Cadastrar Minha Clínica
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-100 to-emerald-50 rounded-3xl -rotate-3 scale-95 opacity-60 filter blur-xl"></div>
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-zinc-100 p-4">
              <Image 
                src="/doctor.png" 
                alt="Dr. Roberto Silva - OdontoPRO" 
                width={400} 
                height={500} 
                className="w-full max-w-[360px] h-auto object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-zinc-50/50 border-t border-zinc-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900">
              Tudo o que sua clínica precisa em um só lugar
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Desenvolvemos ferramentas inteligentes com foco na produtividade do dentista e na experiência do paciente.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="bg-white border border-zinc-100 p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Agendamento Inteligente</h3>
              <p className="text-zinc-600 leading-relaxed">
                Página pública de agendamento personalizada para pacientes marcarem consultas online de forma rápida e intuitiva.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white border border-zinc-100 p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Assistente de Voz IA</h3>
              <p className="text-zinc-600 leading-relaxed">
                Dite as observações clínicas durante a consulta e deixe nossa inteligência artificial gerar a ficha de anamnese formatada.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white border border-zinc-100 p-8 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Gestão de Créditos</h3>
              <p className="text-zinc-600 leading-relaxed">
                Controle os créditos de IA consumidos em transcrições com métricas claras de desempenho e consumo por profissional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section id="professionals" className="py-20 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900">
              Os melhores profissionais da área utilizam o OdontoPRO
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Conheça alguns dos dentistas e especialistas que lideram o atendimento e gerenciam seus consultórios conosco.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Professional 1 */}
            <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="relative h-64 bg-zinc-100 flex items-center justify-center overflow-hidden">
                {/* Fallback image representing doctor */}
                <div className="absolute inset-0 bg-teal-600/10 flex items-center justify-center">
                  <span className="text-4xl">👨‍⚕️</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Ortodontia
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Dr. João Silva</h3>
                  <p className="text-sm text-zinc-500 mb-3">Mestre em alinhadores invisíveis</p>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                    "O agendamento online reduziu em 40% as faltas no meu consultório, os pacientes adoram a facilidade."
                  </p>
                </div>
                <div className="flex items-center gap-1.5 pt-4 border-t border-zinc-50">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-zinc-600 ml-1">5.0 (42 avaliações)</span>
                </div>
              </div>
            </div>

            {/* Professional 2 */}
            <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="relative h-64 bg-zinc-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-teal-600/10 flex items-center justify-center">
                  <span className="text-4xl">👩‍⚕️</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Implantodontia
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Dra. Camila Santos</h3>
                  <p className="text-sm text-zinc-500 mb-3">Especialista em implantes guiados</p>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                    "O assistente de voz com IA é simplesmente fantástico. Termino os prontuários na metade do tempo."
                  </p>
                </div>
                <div className="flex items-center gap-1.5 pt-4 border-t border-zinc-50">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-zinc-600 ml-1">4.9 (58 avaliações)</span>
                </div>
              </div>
            </div>

            {/* Professional 3 */}
            <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="relative h-64 bg-zinc-100 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-teal-600/10 flex items-center justify-center">
                  <span className="text-4xl">👨‍⚕️</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Odontopediatria
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Dr. Ricardo Souza</h3>
                  <p className="text-sm text-zinc-500 mb-3">Odontologia humanizada para crianças</p>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                    "Uma plataforma limpa, rápida e que realmente ajuda na gestão diária. Recomendo de olhos fechados."
                  </p>
                </div>
                <div className="flex items-center gap-1.5 pt-4 border-t border-zinc-50">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-zinc-600 ml-1">5.0 (31 avaliações)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Pronto para transformar sua rotina clínica?
          </h2>
          <p className="mt-4 text-lg text-teal-50">
            Cadastre-se hoje e ganhe 100 créditos de IA gratuitos para testar o assistente de voz e agendamento inteligente.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/sign-up" 
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 font-bold text-teal-600 shadow-md transition hover:bg-teal-50"
            >
              Criar Conta Grátis
            </Link>
            <Link 
              href="/clinica/sorriso-perfeito/agendar" 
              className="inline-flex h-12 items-center justify-center rounded-md border border-teal-400 bg-teal-700/30 px-8 font-bold text-white transition hover:bg-teal-700/50"
            >
              Simular como Paciente
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="border-t border-zinc-100 bg-zinc-50 py-12 text-sm text-zinc-500">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="OdontoPRO Logo" 
              width={100} 
              height={26} 
              className="h-6 w-auto opacity-75 grayscale hover:grayscale-0 transition"
            />
          </div>
          <p>© {new Date().getFullYear()} OdontoPRO. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
      <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
      <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
    </svg>
  );
}

