import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '../../../backend/endpoints/users/userModel'
import { compare } from 'bcryptjs'
import { connectMongo } from '../../../backend/utils/connectMongo'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdministrator: { label: 'IsAdministrator', type: 'text' }
      },
      authorize: async (credentials) => {
        try {
          await connectMongo()
          const { email, password } = credentials

          const user = await User.findOne({ email })

          if (!user) {
            throw new Error('No user found')
          }

          const isValidPassword = await compare(password, user.password)

          if (!isValidPassword) {
            throw new Error('Invalid password')
          }

          return user
        } catch (error) {
          throw new Error('Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    session: async (session) => {
      const email = session?.token?.email
      let user = await User.findOne({ email })
      delete user.password
      session.session.user =
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate,
        isAdministrator: user.isAdministrator,
        isEventmanager: user.isEventmanager
      }
      return session
    },
    async jwt({ token }) {
      return token
    }
  }
})