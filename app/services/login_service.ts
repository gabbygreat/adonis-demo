import User from '#models/user'
import axios from 'axios'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

export default class LoginService {
  async googleLoginService(access_token: string): Promise<User> {
    interface GoogleUser {
      sub: string
      name: string
      given_name: string
      family_name: string
      picture: string
      email: string
      email_verified: boolean
      locale: string
    }

    const { data, status } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    )
    if (status !== 200) {
      throw { error: true, message: 'Network error' }
    }
    const googleUser: GoogleUser = data
    if (googleUser.email_verified) {
      const user = await User.findBy('email', googleUser.email)
      if (user) {
        // if (!user.firstname || !user.lastname) {
        //   user.firstname = googleUser.given_name
        //   user.lastname = googleUser.family_name
        //   await user.save()
        // }
        return user
      } else {
        const user = await User.create({
          email: googleUser.email,
          password: '**',
          registerSource: 'gmail',
        })
        await user.save()
        return user
      }
    } else {
      throw { error: true, message: 'invalid user' }
    }
  }

  async loggedInUser(auth: Authenticator<Authenticators>): Promise<User | null> {
    try {
      if (await auth.check()) {
        return auth.use('api').user!
      }
      return null
    } catch {
      return null
    }
  }
}
