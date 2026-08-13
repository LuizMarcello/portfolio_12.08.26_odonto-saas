import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Verifica se o token de sessão do Better Auth existe nos cookies
  const sessionToken = request.cookies.get("better-auth.session_token") || 
                       request.cookies.get("__Secure-better-auth.session_token");

  // Se o usuário tentar acessar qualquer página protegida (/dashboard) sem estar autenticado
  if (!sessionToken && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

// Executa o middleware em todas as rotas filhas de /dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
