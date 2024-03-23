import { action } from "./_generated/server";
import { internal } from "./_generated/api";

const getTodayWord = async (today) => {
    const response = await fetch(
        `https://www.nytimes.com/svc/wordle/v2/${today}.json`
    )
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const externalData = await response.json();
    console.log("data: ", externalData);

    return externalData
}

const addToDB = async (ctx, data) => {
    const { solution, print_date } = data

    // Insert the processed data into the database
    const dbResponse = await ctx.runMutation(internal.mutations.addWord, {
        word: solution,
        day: print_date
    });

    console.log("== database response: ", dbResponse)
    return dbResponse
}

export const getWord = action({
    args: {},
    handler: async (ctx, _) => {
        const data = await ctx.runQuery(internal.wordle.get)
        const today = new Date().toISOString().slice(0, 10); // Gets today's date in 'YYYY-MM-DD' format

        // Find if today's word already exists
        const todayWordEntry = data.find(entry => entry.day === today);

        if (todayWordEntry) {
            // If today's word exists, return it immediately
            return todayWordEntry;
        }

        // Today's word does not exist
        const word = await getTodayWord(today)

        return await addToDB(ctx, word);

    },
});