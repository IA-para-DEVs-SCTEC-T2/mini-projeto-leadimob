import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { corretor_repository } from '@/infra/repositories/corretor_repository'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null
        
        const corretor = await corretor_repository.find_by_email(
          credentials.email as string
        )
        
        if (!corretor) return null
        
        const valid = await bcrypt.compare(
          credentials.senha as string,
          corretor.password_hash
        )
        
        if (!valid) return null
        
        return { id: corretor.id, name: corretor.nome, email: corretor.email }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.corretor_id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.corretor_id as string
      session.user.corretor_id = token.corretor_id as string
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }, // 7 dias
})