import test, { describe } from "node:test";
import supertest from 'supertest';
import { app } from "../src/index.js";
import assert from "node:assert/strict";

const request = supertest(app);

describe('Book routes', () => {
    test('GET /books returns an empty array', async () => {
        const res = await request.get('/api/v1/books').send();
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, []);
    });

    test('GET /books returns an array of books', async () => {
        await request.post('/api/v1/books').send({
            bookName: 'Example book',
            genres: ['example1', 'example2'],
        });
        const res = await request.get('/api/v1/books').send();
        assert.equal(res.status, 200);
        assert.ok(typeof res.body[0].bookId === 'number');
        delete res.body[0].bookId;
        assert.deepEqual(res.body, [{
            bookName: 'Example book',
            genres: ['example1', 'example2'],
        }]);
    });
});