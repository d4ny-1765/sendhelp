import { ColumnType, Generated } from "kysely";

export type Database = {
  user: UserTable;
  topic: TopicTable;
  room: RoomTable;
  message: messageTable;
  user_follows: followsTable;
};

export type messageTable = {
  messageID: Generated<number>;
  title: string;
  body: string;
  senderID: number;
  createdAt: ColumnType<Date, string | undefined, never>; // Auto-generated on insert
  updatedAt: ColumnType<Date, string | undefined, string | undefined>; // Auto-updated on update
};

export type UserTable = {
  userId: Generated<number>; 
  name: string | null; 
  email: string | null;
  bio: string | null; 
  avatar: string | null;
  password: string | null;
};

export type TopicTable = {
  topicId: Generated<number>; 
  name: string;
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

export type followsTable = {
  followerId: number;
  followingId: number;
  createdAt: Date;
};
