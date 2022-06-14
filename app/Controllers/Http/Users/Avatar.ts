import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/User/Avatar'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UserAvatarController {
  public async update({ request, auth }: HttpContextContract) {
    const response = await Database.transaction(async (trx) => {
      const { file } = await request.validate(UpdateValidator)

      const user = auth.user!.useTransaction(trx)

      const searchPayload = {}
      const savePayload = {
        fileCategory: 'avatar' as any,
        fileName: `${new Date().getTime()}.${file.extname}`
      }

      const avatar = await user.related('avatar').firstOrCreate(searchPayload, savePayload)

      await file.move(Application.tmpPath('uploads'), {
        name: avatar.fileName,
        overwrite: true
      })

      return avatar
    })

    return response
  }
}
