import test, { describe } from "node:test";
import supertest from 'supertest';
import { app } from "../src/index.js";
import assert from "node:assert/strict";

const request = supertest(app);

describe('Message routes', () => {
    test('GET /messages returns an empty array', async () => {
        const res = await request.get('/api/v1/messages').send();
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, []);
    });

    test('GET /messages returns an array of messages', async () => {
        await request.post('/api/v1/messages').send({
            content: 'Test message',
            userId: 1,
            bookId: 1
        });
        const res = await request.get('/api/v1/messages').send();
        assert.equal(res.status, 200);
        assert.ok(typeof res.body[0].id === 'number');
        delete res.body[0].id;
        assert.deepEqual(res.body, [{
            content: 'Test message',
            userId: 1,
            bookId: 1
        }]);
    });
});