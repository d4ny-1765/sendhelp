import { db } from "../db/db.js";

export type Book = {
    bookId: number;
    bookName: string;
    genres: string[];
};

export async function getAllBooks(): Promise<Book[]> {
    const books = await db
        .selectFrom('book')
        .select([ 'bookId', 'bookName' ])
        .execute();
    const genres = await db
        .selectFrom('genre')
        .select(['genreName', 'bookId'])
        .execute();
    const allBooks: Book[] = [];
    for (const book of books) {
        const bookGenres = genres.filter(g => g.bookId === book.bookId);
        allBooks.push({
            ...book,
            genres: bookGenres.map(g => g.genreName),
        });
    }
    return allBooks;
}

export async function getOneBook(bookId: number): Promise<Book> {
    const book = await db.selectFrom('book').select(['bookId', 'bookName']).where('bookId', '=', bookId).executeTakeFirstOrThrow();
    const genres = await db.selectFrom('genre').select(['genreName']).where('bookId', '=', bookId).execute();
    return {
        ...book,
        genres: genres.map(g => g.genreName)
    }
}

export async function createBook(book: Omit<Book, 'bookId'>): Promise<Book> {
    const bookId = await db.transaction().execute(async (trx) => {
        const createdBook = await trx
            .insertInto('book')
            .columns(['bookName'])
            .values({ bookName: book.bookName })
            .returning(['bookId'])
            .executeTakeFirstOrThrow();
        if (book.genres.length > 0) {
            await trx
            .insertInto('genre')
            .columns(['bookId', 'genreName'])
            .values(book.genres.map(g => ({ bookId: createdBook.bookId, genreName: g })))
            .executeTakeFirstOrThrow();
        }
        return createdBook.bookId;
    });
    return {
        ...book,
        bookId,
    }
}