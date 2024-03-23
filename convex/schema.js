import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    wordle: defineTable({
        word: v.string(),
        day: v.string()
    }).index('by_day', ["day"]),

    users: defineTable({
        name: v.string(),
        password: v.string(),
        gameId: v.optional(v.number())
    }).index('by_name', ['name']),

    games: defineTable({
        userId: v.string(),
        guesses: v.array(v.array(v.string())),
        word: v.string(),
        cursor: v.array(v.number()),
        statuses: v.array(v.array(v.string())),
        gameDone: v.boolean()
    }).index('by_userId', ['userId']),

    messages: defineTable({
        gameId: v.string(),
        userId: v.string(),
        sender: v.string(),
        body: v.string()
    }).index('by_gameId', ["gameId"]),

    connections: defineTable({
        gameName: v.string(),
        data: v.string()
    })

});

// guesses: v.object({
//             property: v.array(v.string()),
//         })