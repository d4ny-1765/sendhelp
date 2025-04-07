//test for user
import { describe, test } from "node:test";
import supertest from 'supertest';
import { app } from "../src/index.js";
import assert from "node:assert/strict";

const request = supertest(app);

describe('User routes', () => {
    test('GET /users returns an empty array', async () => {
        const res = await request.get('/api/v1/users').send();
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, []);
    });

    test('GET /users returns an array of users', async () => {
        await request.post('/api/v1/users').send({
            name: 'Example user',
            email: 'example@example.com',
            bio: 'Example bio',
            avatar: 'Example avatar',
            password: 'Example password',
        });
        const res = await request.get('/api/v1/users').send();
        assert.equal(res.status, 200);
        assert.ok(typeof res.body[0].userId === 'number');
        delete res.body[0].userId;
        assert.deepEqual(res.body, [{
            name: 'Example user',
            email: 'example@example.com',
            bio: 'Example bio',
            avatar: 'Example avatar',
            password: 'Example password',
        }]); 
    }); 
}); 

