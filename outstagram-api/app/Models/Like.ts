import { DateTime } from "luxon";
import { BaseModel, column, BelongsTo, belongsTo } from "@ioc:Adonis/Lucid/Orm";
import Post from "./Post";
import User from "./User";

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public postId: number;

  @belongsTo(() => User)
  public user_id: BelongsTo<typeof User>;

  @belongsTo(() => Post)
  public post_id: BelongsTo<typeof Post>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
