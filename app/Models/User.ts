import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { hasMany, HasMany, column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @hasMany(() => Order, {
    foreignKey: 'user_id',
  })
  public orders: HasMany<typeof Order>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
