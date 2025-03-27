import { ColumnType, Generated } from "kysely";
import { User, Topic } from "./types"; // Assuming User and Topic are defined in types.ts

export type Database = {
  room: RoomTable;
};

export type RoomTable = {
  roomId: Generated<number>;
  hostId: ColumnType<number, number | null, number | null>; // Can be null if host is removed
  topicId: ColumnType<number, number | null, number | null>; // Can be null if topic is removed
  name: string;
  description: string | null;
  createdAt: ColumnType<Date, string | undefined, never>; // Auto-generated on insert
  updatedAt: ColumnType<Date, string | undefined, string | undefined>; // Auto-updated on update
};

// Many-to-Many relationship table for participants
export type RoomParticipantsTable = {
  roomId: number;
  userId: number;
};
