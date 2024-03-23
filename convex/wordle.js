import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("wordle").collect();
    },
});

export const getWordByDate = query({
    args: { day: v.string()},
    handler: async (ctx, {day}) => {
        return await ctx.db.query('wordle').filter(q => q.eq(q.field('day'), day)).first();
    }
});