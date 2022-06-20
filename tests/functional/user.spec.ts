import faker from '@faker-js/faker'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Users', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('[store] - able to send mail after pre-registration', async ({ assert, client }) => {
    const email = faker.internet.email()

    const mailer = Mail.fake()

    await client.post('/users/register').form({
      email,
      redirectUrl: 'http://127.0.0.1:3333/users/register'
    })

    assert.isTrue(
      mailer.exists((mail) => {
        return mail.from?.address === 'contato@facebook.com' && mail.from.name === 'Facebook' && mail.subject === 'Confirmação de cadastro'
      })
    )

    Mail.restore()
  })
})
