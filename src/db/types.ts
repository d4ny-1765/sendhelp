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

export type User = {
  userId: Generated<number>; 
  name: string | null; 
  email: string | null;
  bio: string | null; 
  avatar: string | null;
};

export type Topic = {
  topicId: Generated<number>; 
  name: string;
};