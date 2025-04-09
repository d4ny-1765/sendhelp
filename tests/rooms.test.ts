import { describe, test } from "node:test";
import supertest from "supertest";
import { app } from "../src/index.js"; // Adjust path if needed
import assert from "node:assert/strict";

const request = supertest(app);

describe("Room routes", () => {
    test("GET /rooms returns an empty array initially", async () => {
        const res = await request.get("/api/v1/rooms").send();
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, []);
    });

    test("POST /rooms creates a room", async () => {
        const newRoom = {
            hostId: 1,
            topicId: 1,
            name: "Example Room",
            description: "A room for testing.",
        };
        const res = await request.post("/api/v1/rooms").send(newRoom);
        assert.equal(res.status, 201);
        const room = res.body;
        assert.ok(room.roomId);
        assert.equal(room.name, newRoom.name);
        assert.equal(room.description, newRoom.description);
        assert.equal(room.hostId, newRoom.hostId);
        assert.equal(room.topicId, newRoom.topicId);
    });

    test("GET /rooms returns an array with the created room", async () => {
        const res = await request.get("/api/v1/rooms").send();
        assert.equal(res.status, 200);
        assert.ok(Array.isArray(res.body));
        assert.ok(res.body.length > 0);
    });

    test("GET /rooms/:roomId returns the specific room", async () => {
        const createRes = await request.post("/api/v1/rooms").send({
            hostId: 2,
            topicId: 2,
            name: "Another Room",
            description: "Second test room",
        });
        const createdRoom = createRes.body;

        const res = await request.get(`/api/v1/rooms/${createdRoom.roomId}`);
        assert.equal(res.status, 200);
        assert.equal(res.body.name, "Another Room");
    });

    test("PUT /rooms/:roomId updates a room", async () => {
        const createRes = await request.post("/api/v1/rooms").send({
            hostId: 3,
            topicId: 3,
            name: "Room To Update",
            description: "Before update",
        });
        const createdRoom = createRes.body;

        const updates = { name: "Updated Room Name", description: "After update" };
        const res = await request
            .put(`/api/v1/rooms/${createdRoom.roomId}`)
            .send(updates);

        assert.equal(res.status, 200);
        assert.equal(res.body.name, updates.name);
        assert.equal(res.body.description, updates.description);
    });

    test("DELETE /rooms/:roomId deletes a room", async () => {
        const createRes = await request.post("/api/v1/rooms").send({
            hostId: 4,
            topicId: 4,
            name: "Room To Delete",
            description: "Temporary",
        });
        const createdRoom = createRes.body;

        const deleteRes = await request.delete(`/api/v1/rooms/${createdRoom.roomId}`);
        assert.equal(deleteRes.status, 204);

        const fetchRes = await request.get(`/api/v1/rooms/${createdRoom.roomId}`);
        assert.ok(fetchRes.status === 404 || fetchRes.status === 500); // Depends on how you handle errors
    });
});
