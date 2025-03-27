import { ColumnType, Generated } from "kysely";

export type Database = {
  book: BookTable;
  genre: GenreTable;
};

export type BookTable = {
  bookId: Generated<number>;
  bookName: string;
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