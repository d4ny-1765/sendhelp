import { ColumnType, Generated } from "kysely";

export type Database = {
  book: messageTables;
  genre: GenreTable;
};

export type messageTables = {
  messageID: Generated<number>;
  MsgTitle: string;
  MsgBody: string;
  MsgSenderID: number;
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

export type RoomTable = {
  roomId: Generated<number>;
  hostId: ColumnType<number, number | null, number | null>; // Can be null if host is removed
  topicId: ColumnType<number, number | null, number | null>; // Can be null if topic is removed
  name: string;
  description: string | null;
  createdAt: ColumnType<Date, string | undefined, never>; // Auto-generated on insert
  updatedAt: ColumnType<Date, string | undefined, string | undefined>; // Auto-updated on update
};
