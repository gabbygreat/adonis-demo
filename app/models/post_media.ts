import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Post from './post.js'

export default class PostMedia extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare postId: string

  @column()
  declare url: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Post, { foreignKey: 'postId', localKey: 'id' })
  declare post: BelongsTo<typeof Post>
}
