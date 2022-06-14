import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png']
    })
  })

  public cacheKey = this.ctx.routeKey

  public messages = {}
}