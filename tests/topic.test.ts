//test for topic
import { describe, test } from "node:test";
import supertest from 'supertest';
import { app } from "../src/index.js";
import assert from "node:assert/strict";

const request = supertest(app);

describe('Topic routes', () => {
    test('GET /topics returns an empty array', async () => {
        const res = await request.get('/api/v1/topics').send();
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, []);
    });
});
