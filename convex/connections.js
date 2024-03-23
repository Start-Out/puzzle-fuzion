import {mutation, query} from './_generated/server';
import {v} from 'convex/values';

export const getGame = query({
    args: { _id: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (args._id !== "hla") {
            const game = await ctx.db
                .query('connections')
                .filter((q) => q.eq(q.field('_id'), args._id))
                .first();
            console.log("game: ", game)
            return game
        }
        return false
    }
})

export const createGame = mutation({
    args: {
        gameName: v.string(),
        data: v.string(),
    },
    handler: async (ctx, args) => {

        return await ctx.db.insert('connections', {
            gameName: args.gameName,
            data: args.data
        })
    }
})