import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Wachtwoord', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.email === 'klaas@mrfris.nl' &&
          credentials?.password === 'nodefy123'
        ) {
          return { id: '1', name: 'Klaas', email: 'klaas@mrfris.nl' }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
})
