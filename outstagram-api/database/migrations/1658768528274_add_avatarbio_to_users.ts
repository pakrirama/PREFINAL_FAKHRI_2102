import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string("avatar").after("email");
      table.string("bio").after("avatar");
    });
  }

  public async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.dropColumn("avatar");
      table.dropColumn("bio");
    });
  }
}
