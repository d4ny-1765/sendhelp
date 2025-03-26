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