import { faker } from '@faker-js/faker'
import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, UserKey } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/ForgotPassword'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    const { email } = await request.validate(StoreValidator)

    const user = await User.findByOrFail('email', email)

    const key = faker.datatype.uuid() + user.id

    user.related('keys').create({ key })

    const link = `http://127.0.0.1:3333/users/forgot-password/${key}`

    console.log({ link })

    await Mail.send((message) => {
      message.to(email)
      message.from('contato@facebook.com', 'Facebook')
      message.subject('Redefinição de Senha')
      message.htmlView('emails/forgot-password', { link })
    })

    return response.ok({ message: 'E-mail de redefinição de senha enviado com sucesso' })
  }

  public async show({ params }: HttpContextContract) {
    await UserKey.findByOrFail('key', params.key)
  }

  public async update({ request }: HttpContextContract) {
    const { key, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail('key', key)

    await userKey.load('user')

    userKey.user.merge({ password })

    await userKey.user.save()

    await userKey.delete()

    return { message: 'Senha atualizada com sucesso' }
  }
}
