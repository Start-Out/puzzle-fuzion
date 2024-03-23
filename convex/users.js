import { query, internalMutation, internalQuery, mutation} from './_generated/server';
import { v } from 'convex/values';

export const getUsers = query({
    handler: async (ctx) => {
        return await ctx.db.query('users').collect()
    }
})

export const getUser = query({
    args: { _id: v.string() },
    handler: async (ctx, args) => {
        const currentUser = await ctx.db
            .query('users')
            .filter( (q) => q.eq(q.field('_id'), args._id))
            .first()

        return currentUser ? currentUser : null
    }
})

export const getUserByNameAndPassword = mutation({
    args: {name: v.string(), password: v.string()},
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field('name'), args.name))
            .filter((q) => q.eq(q.field('password'), args.password))
            .first();

        if (user) {
            return user._id;
        }

        return false
    },
})

export const createUser = mutation({
    args: { name: v.string(), password: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field('name'), args.name))
            .filter((q) => q.eq(q.field('password'), args.password))
            .first();

        if (user) {
            return user._id;
        }

        const newUser = await ctx.db.insert('users', {
            name: args.name,
            password: args.password
        });

        console.log("New user has been created: ", newUser)

        return newUser
    },
});