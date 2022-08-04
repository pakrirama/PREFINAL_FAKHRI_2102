import { DateTime } from "luxon";
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  hasMany,
  HasMany,
  computed,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Comment from "./Comment";
import Like from "./Like";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public image: string;

  @column()
  public caption: string;

  @column()
  public location: string | null;

  @column()
  public likes: number;

  @hasMany(() => Like)
  public like: HasMany<typeof Like>;

  @column()
  public userId: number;

  @belongsTo(() => User)
  public user_id: BelongsTo<typeof User>;

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>;

  @computed()
  public get total_comment() {
    return this.comments?.length;
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
