import { db } from "../db/db.js";

export type Message = {
    messageId: number;
    content: string;
    tags: string[];
};

export async function getAllMessages(): Promise<Message[]> {
    const messages = await db
        .selectFrom('message')
        .select(['messageId', 'content'])
        .execute();
    const tags = await db
        .selectFrom('tag')
        .select(['tagName', 'messageId'])
        .execute();
    const allMessages: Message[] = [];
    for (const message of messages) {
        const messageTags = tags.filter(t => t.messageId === message.messageId);
        allMessages.push({
            ...message,
            tags: messageTags.map(t => t.tagName),
        });
    }
    return allMessages;
}

export async function getOneMessage(messageId: number): Promise<Message> {
    const message = await db
        .selectFrom('message')
        .select(['messageId', 'content'])
        .where('messageId', '=', messageId)
        .executeTakeFirstOrThrow();
    const tags = await db
        .selectFrom('tag')
        .select(['tagName'])
        .where('messageId', '=', messageId)
        .execute();
    return {
        ...message,
        tags: tags.map(t => t.tagName),
    };
}

export async function createMessage(message: Omit<Message, 'messageId'>): Promise<Message> {
    const messageId = await db.transaction().execute(async (trx) => {
        const createdMessage = await trx
            .insertInto('message')
            .columns(['content'])
            .values({ content: message.content })
            .returning(['messageId'])
            .executeTakeFirstOrThrow();
        if (message.tags.length > 0) {
            await trx
                .insertInto('tag')
                .columns(['messageId', 'tagName'])
                .values(message.tags.map(t => ({ messageId: createdMessage.messageId, tagName: t })))
                .executeTakeFirstOrThrow();
        }
        return createdMessage.messageId;
    });
    return {
        ...message,
        messageId,
    };
}
