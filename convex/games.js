import {mutation, query} from './_generated/server';
import {v} from 'convex/values';

export const getGames = query({
    args: { },
    handler: async (ctx) => {
        return ctx.db
            .query('games')
            .collect()
    }
})

export const getGame = query({
    args: { _id: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query('games')
            .filter( (q) => q.eq(q.field('_id'), args._id))
            .first()
    }
})

export const createGame = mutation({
    args: {
        userId: v.string(),
        guesses: v.array(v.array(v.string())),
        word: v.string(),
        cursor: v.array(v.number()),
        statuses: v.array(v.array(v.string()))
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('games', {
            userId: args.userId,
            guesses: args.guesses,
            word: args.word,
            cursor: args.cursor,
            statuses: args.statuses,
            gameDone: false
        })
    }
})

export const updateGuess = mutation({
    args: {
        _id: v.id('games'),
        cursor: v.array(v.number()),
        letter: v.string(),
    },
    handler: async (ctx, args) => {
        const {cursor, letter} = args
        const game = await ctx.db.get(args._id)

        if (!game) {
            throw new Error("Game not found");
        }

        const updatedGuesses = game.guesses.slice(); // Make a shallow copy
        if ( cursor[1] < 4 ) {
            cursor[1] = cursor[1] + 1
            // Update the specific cell with the new letter
            updatedGuesses[cursor[0]][cursor[1]] = letter;
        }
        // Save the updated game state back to the database
        await ctx.db.patch(args._id, {
            guesses: updatedGuesses,
            cursor: cursor
        });

        return true;
    }
})

export const removeGuess = mutation({
    args: {
        _id: v.id('games'),
        cursor: v.array(v.number()),
    },
    handler: async (ctx, args) => {
        const {cursor} = args
        const game = await ctx.db.get(args._id)

        if (!game) {
            throw new Error("Game not found");
        }

        const updatedGuesses = game.guesses.slice(); // Make a shallow copy
        if ( cursor[1] > -1 ) {
            // Update the specific cell with the new letter
            updatedGuesses[cursor[0]][cursor[1]] = "";
            cursor[1] = cursor[1] - 1
        }
        // Save the updated game state back to the database
        await ctx.db.patch(args._id, {
            guesses: updatedGuesses,
            cursor: cursor
        });

        return true;
    }
})

export const submitGuess = mutation({
    args: {
        _id: v.id('games'),
        cursor: v.array(v.number()),
        guess: v.string()
    },
    handler: async (ctx, args) => {
        const {cursor, guess} = args
        const game = await ctx.db.get(args._id)

        if (!game) {
            throw new Error("Game not found");
        }

        const updatedGuesses = game.guesses.slice(); // Make a shallow copy
        const updatedStatuses = game.statuses.slice()
        let result
        if ( cursor[0] < 6 ) {
            // analyze the word, update the status
            result = analyzeWord(guess, game.word)
            updatedStatuses[cursor[0]] = result
            // update cursor
            cursor[0] = cursor[0] + 1
            cursor[1] = -1
        }

        // Save the updated game state back to the database
        await ctx.db.patch(args._id, {
            guesses: updatedGuesses,
            cursor: cursor,
            statuses: updatedStatuses
        });

        return result;
    }
})

export const toggleGameDone = mutation({
    args: {
        _id: v.id('games')
    },
    handler: async (ctx, args) => {
        const game = await ctx.db.get(args._id)

        if (!game) {
            throw new Error("Game not found");
        }

        await ctx.db.patch(args._id, {
            gameDone: true
        });

        return true;
    }
})


const analyzeWord = (word, wordleWord) => {
    let result = [];

    // Convert wordleWord into an array to manipulate its characters
    let wordleChars = wordleWord.split('');

    word.split('').forEach((char, index) => {
        if (wordleChars[index] === char) {
            result.push('correct');
        } else if (wordleChars.includes(char)) {
            result.push('present');
        } else {
            result.push('absent');
        }
    });
    return result
};