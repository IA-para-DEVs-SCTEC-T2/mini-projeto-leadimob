import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      corretor_id: string
      name?: string | null
      email?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    corretor_id?: string
  }
}
