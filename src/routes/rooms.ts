import express from "express";
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, getRoomsByTopic } from "../repositories/rooms.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = "secret";
const JWT_EXPIRES_IN = "24h";
const router = express.Router();

// Get rooms (all or filtered by topic)
router.get("/rooms", async (req, res, next) => {
    try {
        const topicId = req.query.topicId;
        const rooms = topicId
            ? await getRoomsByTopic(Number(topicId))
            : await getAllRooms();
        res.json(rooms);
    } catch (err) {
        next(err);
    }
});

// Get a room by ID
router.get("/rooms/:roomId", async (req, res, next) => {
    try {
        const room = await getRoomById(+req.params.roomId);
        res.json(room);
    } catch (err) {
        next(err);
    }
});

// Create a new room (hostId derived from JWT)
router.post("/rooms", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header missing or invalid' });
      return;
    }
    const token = authHeader.split(' ')[1];
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    } catch (e) {
      console.log(token);
      console.log(JWT_SECRET);
      res.status(401).json({ error: 'Invalid token2' });
      return;
    }
    const hostId = Number(payload.sub);
    const { name, description, topicId } = req.body;
    if (topicId == null) {
      res.status(400).json({ error: 'topicId is required' });
      return;
    }
    if (name == null) {
      res.status(400).json({ error: 'name is required' });
      return;
    }
    const newRoom = await createRoom({
      hostId,
      topicId: Number(topicId),
      name: String(name),
      description: description == null ? null : String(description)
    });
    res.status(201).json(newRoom);
  } catch (err: any) {
    if (err.code === '23503') {
      res.status(400).json({ error: 'Invalid topicId' });
      return;
    }
    next(err);
  }
});

// Update a room
router.put("/rooms/:roomId", async (req, res, next) => {
    try {
        const updatedRoom = await updateRoom(+req.params.roomId, req.body);
        res.json(updatedRoom);
    } catch (err) {
        next(err);
    }
});

// Delete a room
router.delete("/rooms/:roomId", async (req, res, next) => {
    try {
        await deleteRoom(+req.params.roomId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

export default router;
