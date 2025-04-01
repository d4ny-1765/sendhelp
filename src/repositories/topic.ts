import { db } from "../db/db.js";
import { Database } from "../db/types.js";

export type Topic = {
    topicId: number;
    name: string;
};

export async function getAllTopics(): Promise<Topic[]> {
    return await db
        .selectFrom('topic')
        .select(['topicId', 'name'])
        .execute();
}

export async function getTopicById(topicId: number): Promise<Topic> {
    return await db
        .selectFrom('topic')
        .select(['topicId', 'name'])
        .where('topicId', '=', topicId)
        .executeTakeFirstOrThrow();
}

export async function createTopic(topic: Omit<Topic, 'topicId'>): Promise<Topic> {
    const { name } = topic;
    const insertedTopic = await db.transaction().execute(async (trx) => {
        const result = await trx
            .insertInto('topic')
            .columns(['name'])
            .values({ name })
            .returning(['topicId', 'name'])
            .executeTakeFirstOrThrow();
        return result;
    });
    return insertedTopic;
}

export async function updateTopic(topic: Topic): Promise<Topic> {
    const { topicId, name } = topic;
    const updatedTopic = await db.transaction().execute(async (trx) => {
        const result = await trx
            .updateTable('topic')
            .set({ name })
            .where('topicId', '=', topicId)
            .returning(['topicId', 'name'])
            .executeTakeFirstOrThrow();
        return result;
    });
    return updatedTopic;
}

export async function deleteTopic(topicId: number): Promise<void> {
    await db
        .deleteFrom('topic')
        .where('topicId', '=', topicId)
        .execute();
}


