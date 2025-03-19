import User from '#models/user'
import { googleLoginValidator, registrationValidator } from '#validators/register'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { lowerCase, sendError, sendSuccess } from '../utils/utils.js'
import LocalizationService from '#services/localization_service'
import { loginValidator } from '#validators/login'
import LoginService from '#services/login_service'
import AuthResponseDTO from '../response/user_response.js'

@inject()
export default class UsersController {
  constructor(protected loginService: LoginService) {}
  async register({ request, response }: HttpContext) {
    try {
      await request.validateUsing(registrationValidator)
      const { email, password } = request.body()
      const user = await db.transaction(async (client) => {
        const newUser = await User.create({ email: lowerCase(email), password }, { client })
        return newUser
      })
      const token = await User.accessTokens.create(user)
      const userDTO: AuthResponseDTO = {
        user: user,
        token,
      }
      return sendSuccess(response, {
        message: LocalizationService.getMessage(request.lang, 'account_created'),
        data: userDTO,
        code: 201,
      })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      await request.validateUsing(loginValidator)
      const { email, password } = request.body()
      const user = await User.verifyCredentials(lowerCase(email), password)
      const token = await User.accessTokens.create(user)
      const userDTO: AuthResponseDTO = {
        user: user,
        token,
      }
      return sendSuccess(response, {
        message: LocalizationService.getMessage(request.lang, 'login_success'),
        data: userDTO,
        code: 200,
      })
    } catch (error) {
      return sendError(response, { error })
    }
  }

  async loginOtherSource({ request, response }: HttpContext) {
    try {
      await request.validateUsing(googleLoginValidator)
      const { access_token, source } = request.body()
      let user: User
      switch (source) {
        case 'google':
          user = await this.loginService.googleLoginService(access_token)
          break
        default:
          return sendError(response, { message: 'Invalid source selected' })
      }
      const token = await User.accessTokens.create(user, [], { expiresIn: '100 days' })
      const userDTO: AuthResponseDTO = {
        user: user,
        token,
      }
      return sendSuccess(response, {
        message: LocalizationService.getMessage(request.lang, 'login_success'),
        data: userDTO,
        code: 200,
      })
    } catch (error) {
      return sendError(response, { code: 500, error: error })
    }
  }
}
