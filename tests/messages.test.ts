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

    test('GET /messages/:messageId returns a message', async () => {
        const res = await request.get('/api/v1/messages/1').send();
        assert.equal(res.status, 200);
        assert.ok(typeof res.body.id === 'number');
        delete res.body.id;
        assert.deepEqual(res.body, {
            content: 'Test message',
            userId: 1,
            bookId: 1
        });
    });

    test('POST /messages creates a message', async () => {
        const newMessage = {
            content: 'Test message',
            userId: 1,
            bookId: 1
        };

        const res = await request.post('/api/v1/messages').send(newMessage);
        assert.equal(res.status, 201);

        const message: Message = res.body;
        assert.ok(message.id);
        assert.equal(message.content, newMessage.content);
        assert.equal(message.userId, newMessage.userId);
        assert.equal(message.bookId, newMessage.bookId);

        createdMessage = message;
    });

    test('PUT /messages/:messageId updates a message', async () => {
        const newMessage = { content: 'Original message' };
        const createRes = await request
            .post('/api/v1/messages')
            .send(newMessage);
        const createdMessage = createRes.body;
        
        const updates = { content: 'Updated message' };
        const res = await request
            .put(`/api/v1/messages/${createdMessage.id}`)
            .send(updates);
        assert.equal(res.status, 200);
        assert.equal(res.body.content, updates.content);
    });

    test('DELETE /messages/:messageId deletes a message', async () => {
        const newMessage = { content: 'Original message' };
        const createRes = await request
            .post('/api/v1/messages')
            .send(newMessage);
        const createdMessage = createRes.body;

        const res = await request.delete(`/api/v1/messages/${createdMessage.id}`);
        assert.equal(res.status, 204);

        const fetchRes = await request.get(`/api/v1/messages/${createdMessage.id}`);
        assert.equal(fetchRes.status, 500); // or 404 if handled
    });
});