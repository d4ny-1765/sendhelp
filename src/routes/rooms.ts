import express from "express";
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom } from "../repositories/rooms.js";

const router = express.Router();

// Get all rooms
router.get("/rooms", async (req, res, next) => {
    try {
        const rooms = await getAllRooms();
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

// Create a new room
router.post("/rooms", async (req, res, next) => {
    try {
        const room = await createRoom(req.body);
        res.status(201).json(room);
    } catch (err) {
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
