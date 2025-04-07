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

    test('POST /users creates a user', async () => { 
        const newUser = { 
            name: 'Example user', 
            email: 'example@example.com', 
            bio: 'Example bio', 
            avatar: 'Example avatar', 
            password: 'Example password', 
        }; 
        const res = await request.post('/api/v1/users').send(newUser); 
        assert.equal(res.status, 201); 
        const user = res.body; 
        assert.ok(user.userId); 
        assert.equal(user.name, newUser.name); 
        assert.equal(user.email, newUser.email); 
        assert.equal(user.bio, newUser.bio); 
        assert.equal(user.avatar, newUser.avatar); 
        assert.equal(user.password, newUser.password); 
    }); 

    test('PUT /users/:userId updates a user', async () => { 
        const newUser = { name: 'Updated user' }; 
        const createRes = await request
            .post('/api/v1/users') 
            .send({ 
                name: 'Example user', 
                email: 'example@example.com', 
                bio: 'Example bio', 
                avatar: 'Example avatar', 
                password: 'Example password', 
            }); 
        const createdUser = createRes.body; 
         
        const updates = { name: 'Updated user' }; 
        const res = await request
            .put(`/api/v1/users/${createdUser.userId}`) 
            .send(updates); 
        assert.equal(res.status, 200); 
        assert.equal(res.body.name, updates.name); 
    }); 
    
    test('DELETE /users/:userId deletes a user', async () => {  
        const newUser = {  
            name: 'Example user',  
            email: 'example@example.com',  
            bio: 'Example bio',  
            avatar: 'Example avatar',  
            password: 'Example password',  
        };  
        const createRes = await request  
            .post('/api/v1/users')  
            .send(newUser);  
        const createdUser = createRes.body;  
         
        const res = await request.delete(`/api/v1/users/${createdUser.userId}`);  
        assert.equal(res.status, 204);  
        const fetchRes = await request.get(`/api/v1/users/${createdUser.userId}`);  
        assert.equal(fetchRes.status, 500); // or 404 if handled  
    });  
}); 

