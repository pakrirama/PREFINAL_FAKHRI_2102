import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Post from "./Post";

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public comment: string;

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
