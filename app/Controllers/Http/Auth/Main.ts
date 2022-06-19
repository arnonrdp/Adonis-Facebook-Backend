import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/Auth'

export default class AuthController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = await request.validate(StoreValidator)

    try {
      const token = await auth.attempt(email, password, { expiresIn: '30 days' })
      return token
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.logout()
  }
}
