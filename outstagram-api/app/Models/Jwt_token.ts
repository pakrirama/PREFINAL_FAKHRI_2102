import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Jwt_token extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public name: string;

  @column()
  public type: string;

  @column()
  public token: string;

  @column.dateTime()
  public expires_at: DateTime;

  @column()
  public refresh_token: string;

  @belongsTo(() => User)
  public user_id: BelongsTo<typeof User>;

  @column.dateTime()
  public createdAt: DateTime;
}
