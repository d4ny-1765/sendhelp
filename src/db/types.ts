import { ColumnType, Generated } from "kysely";

export type Database = {
  book: messageTables;
  genre: GenreTable;
};

export type messageTables = {
  messageID: Generated<number>;
  MsgTitle: string;
  MsgBody: string;
  
};

export type GenreTable = {
  genreId: Generated<number>;
  genreName: string;
  bookId: ColumnType<number, number, undefined>; // Insert as number, but no updates
}