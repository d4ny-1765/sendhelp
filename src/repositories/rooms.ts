import { db } from "../db/db.js";
import { RoomTable } from "../db/types.js";

export type Room = {
    roomId: number;
    hostId: number | null;
    topicId: number | null;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
};

// Get all rooms
export async function getAllRooms(): Promise<Room[]> {
    return await db
        .selectFrom("room")
        .select(["roomId", "hostId", "topicId", "name", "description", "createdAt", "updatedAt"])
        .execute();
}

// Get a room by ID
export async function getRoomById(roomId: number): Promise<Room> {
    return await db
        .selectFrom("room")
        .select(["roomId", "hostId", "topicId", "name", "description", "createdAt", "updatedAt"])
        .where("roomId", "=", roomId)
        .executeTakeFirstOrThrow();
}

// Create a new room
export async function createRoom(room: Omit<Room, "roomId" | "createdAt" | "updatedAt">): Promise<Room> {
    const { hostId, topicId, name, description } = room;
    const insertedRoom = await db.transaction().execute(async (trx) => {
        const result = await trx
            .insertInto("room")
            .columns(["hostId", "topicId", "name", "description"])
            .values({ hostId, topicId, name, description })
            .returning(["roomId", "hostId", "topicId", "name", "description", "createdAt", "updatedAt"])
            .executeTakeFirstOrThrow();
        return result;
    });
    return insertedRoom;
}
export type RoomUpdate = Partial<Pick<Room, "hostId" | "topicId" | "name" | "description">>;

// Update a room
export async function updateRoom(roomId: number, updates: RoomUpdate): Promise<Room> {
    return await db
        .updateTable("room")
        .set({ ...updates })  // Ensure updates only contains known properties
        .where("roomId", "=", roomId)
        .returning(["roomId", "hostId", "topicId", "name", "description", "createdAt", "updatedAt"])
        .executeTakeFirstOrThrow();
}

// Delete a room
export async function deleteRoom(roomId: number): Promise<void> {
    await db.transaction().execute(async (trx) => {
        await trx.deleteFrom("room").where("roomId", "=", roomId).execute();
    });
}
