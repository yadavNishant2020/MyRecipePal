require('dotenv').config();
const apiKey = process.env.API_KEY;
// console.log(apiKey);


export const searchRecipes = async (searchTerm: string, page: number) => {
    if (!apiKey) {
        throw new Error("API key not found.")
    }

    if (typeof searchTerm !== "string" || typeof page !== "number") {
        throw new Error("Invalid parameters.");
    }

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

    const queryParams = {
        apiKey: apiKey,
        query: searchTerm,
        number: "10",
        offset: (page * 10).toString()
    }

    url.search = new URLSearchParams(queryParams).toString() //Attach each value pairs to the url

    try {
        const searchRes = await fetch(url);
        const resultJSON = await searchRes.json();
        return resultJSON;
    } catch (error: any) {
        throw new Error(`Error fetching recipes: ${(error as Error).message}`);
    }
};

export const getRecipeSummary = async (recipeId: string) => {

    if (!apiKey) {
        throw new Error("API key not found.")
    }

    const url = new URL(`https://api.spoonacular.com/recipes/${recipeId}/summary`)

    const queryParams = {
        apiKey: apiKey,
    }

    url.search = new URLSearchParams(queryParams).toString();

    const response = await fetch(url);
    const json = await response.json();

    return json;

};

export const getFavRecipedByIDs = async (ids: string[]) => {
    if (!apiKey) {
        throw new Error("API key not found.")
    }

    const url = new URL("https://api.spoonacular.com/recipes/informationBulk")

    const queryParams = {
        apiKey: apiKey,
        ids: ids.join(",")
    }

    url.search = new URLSearchParams(queryParams).toString()

    const searchResponse = await fetch(url);
    const json = await searchResponse.json();

    return {results: json};
}