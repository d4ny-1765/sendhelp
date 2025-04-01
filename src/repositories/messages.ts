import { db } from "../db/db.js";

export type Message = {
    messageID: number;
    title: string;
    body: string;
    senderID: number;
    createdAt: Date;
    updatedAt: Date;
};

export async function getAllMessages(): Promise<Message[]> {
    const messages = await db
        .selectFrom('message')
        .select(['messageID', 'title', 'body', 'senderID', 'createdAt', 'updatedAt'])
        .execute();
    return messages;
}

export async function getOneMessage(messageId: number): Promise<Message> {
    const message = await db
        .selectFrom('message')
        .select(['messageID', 'title', 'body', 'senderID', 'createdAt', 'updatedAt'])
        .where('messageID', '=', messageId)
        .executeTakeFirstOrThrow();
    return message;
}

export async function createMessage(message: Omit<Message, 'messageID'>): Promise<Message> {
    const messageId = await db.transaction().execute(async (trx) => {
        const createdMessage = await trx
            .insertInto('message')
            .columns(['title', 'body', 'senderID'])
            .values({ title: message.title, body: message.body, senderID: message.senderID })
            .returning(['messageID'])
            .executeTakeFirstOrThrow();
        return createdMessage.messageID;
    });
    return {
        ...message,
        messageID: messageId,
    };
}
