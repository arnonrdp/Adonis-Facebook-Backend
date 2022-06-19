import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import faker from '@faker-js/faker'

test.group('auth', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('[store] - able to authenticate with valid credentials', async ({ assert, client }) => {
    const user = await UserFactory.merge({ password: 'secret' }).create()

    const { response } = await client.post('/auth').json({
      email: user.email,
      password: 'secret'
    })

    assert.equal(response.status, 200)
    assert.exists(response.body.token)
  })

  test('[store] - fail to authenticate with invalid credentials', async ({ assert, client }) => {
    const { response } = await client.post('/auth').json({
      email: faker.internet.email(),
      password: 'secret'
    })

    assert.equal(response.status, 401)
  })

  test('[destroy] - able to delete token after logout', async ({ assert, client }) => {
    const user = await UserFactory.merge({ password: 'secret' }).create()

    const { response: loginResponse } = await client.post('/auth').json({
      email: user.email,
      password: 'secret'
    })

    await client.delete('/auth').header('Authorization', `Bearer ${loginResponse.body.token}`)

    const token = await Database.from('api_tokens').where('user_id', user.id).first()

    assert.isNull(token)
  })
})
