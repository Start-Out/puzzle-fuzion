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
        console.log("guesses: ", args.guesses)
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
        console.log("in db: ", args._id, " c: ", cursor, " l: ", letter)
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
        else {
            console.log("DISALLOWWW!!")
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
        console.log("r, in db: ", args._id, " c: ", cursor)
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
        else {
            console.log("DISALLOWWW!!")
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
        console.log("r, in db: ", args._id, " c: ", cursor, " g: ", guess)
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
        else {
            console.log("DISALLOWWW!!")
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
            // Correct character in the correct position
            result.push('correct');
            wordleChars[index] = null; // Mark this character as checked
        } else if (wordleChars.includes(char)) {
            // Correct character in the wrong position
            result.push('present');
            // Mark the first occurrence of this character as checked
            wordleChars[wordleChars.indexOf(char)] = null;
        } else {
            result.push('absent');
        }
    });

    console.log("final result: ", result)
    return result
};