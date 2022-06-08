import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    redirectUrl: schema.string({ trim: true })
  })

  public messages = {}
}
