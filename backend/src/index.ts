import "dotenv/config";
import express from "express"
import cors from "cors"
import * as RecipeAPI from "./recipe-api"


const app = express();
const port = 4000;

app.use(express.json())
app.use(cors())

app.get("/api/recipes/search", async (req, res) => {
    // https://api.spoonacular.com/recipes/serach?searchTerm=burger&page=2

    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);

    const results = await RecipeAPI.searchRecipes(searchTerm,page);

    return res.json(results);
})

app.get("/api/recipes/:recipeId/summary",async (req, res) => {

    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeSummary(recipeId)

    return res.json(results);
})

app.listen(port, ()=>{
    console.log(`Server running at port ${port}`);
})