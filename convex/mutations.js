import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addWord = mutation({
    args: {
        word: v.string(), day: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("wordle", {
            word: args.word,
            day: args.day
        });
    },
});