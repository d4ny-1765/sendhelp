import test, { describe, beforeEach } from "node:test";
import supertest from "supertest";
import { app } from "../src/index.js"; // adjust if your file is `index.ts` and ESM setup allows `.ts` imports
import assert from "node:assert/strict";

const request = supertest(app);

type Room = {
  roomId: number;
  hostId: number | null;
  topicId: number | null;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

describe("Room routes", () => {
  let createdRoom: Room;

  beforeEach(async () => {
    // Optional: clear the rooms table using a DELETE-all route or direct DB call in a real test setup
  });

  test("GET /rooms returns an empty array", async () => {
    const res = await request.get("/api/v1/rooms");
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });

  test("POST /rooms creates a room", async () => {
    const newRoom = {
      hostId: 1,
      topicId: 1,
      name: "Test Room",
      description: "This is a test room",
    };

    const res = await request.post("/api/v1/rooms").send(newRoom);
    assert.equal(res.status, 201);

    const room: Room = res.body;
    assert.ok(room.roomId);
    assert.equal(room.name, newRoom.name);
    assert.equal(room.description, newRoom.description);

    createdRoom = room;
  });

  test("GET /rooms/:roomId returns the created room", async () => {
    const res = await request.get(`/api/v1/rooms/${createdRoom.roomId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.roomId, createdRoom.roomId);
    assert.equal(res.body.name, "Test Room");
  });

  test("PUT /rooms/:roomId updates the room", async () => {
    const updates = { name: "Updated Room Name" };
    const res = await request
      .put(`/api/v1/rooms/${createdRoom.roomId}`)
      .send(updates);
    assert.equal(res.status, 200);
    assert.equal(res.body.name, updates.name);
  });

  test("DELETE /rooms/:roomId deletes the room", async () => {
    const res = await request.delete(`/api/v1/rooms/${createdRoom.roomId}`);
    assert.equal(res.status, 204);

    const fetchRes = await request.get(`/api/v1/rooms/${createdRoom.roomId}`);
    assert.equal(fetchRes.status, 500); // or 404 if handled
  });
});
