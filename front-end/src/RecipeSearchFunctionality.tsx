import { FormEvent, useState, useRef, useEffect } from "react";
import "./App.css"
import * as api from './api'
import { Recipe } from "./types";
import { RecipeCard } from "./components/ReceipeCard";
import RecipeModal from "./components/RecipeModal";

type Tabs = "search" | "favrourites";

const RecipeSearchFunctionality = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [selectesTab, setSelectedTab] = useState<Tabs>("search");
  const [favouriteRecipes, setfavouriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);


  useEffect(() => {
    const fetchFavRecipe = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setfavouriteRecipes(favouriteRecipes.results);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFavRecipe();
  }, [])

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {

      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
      pageNumber.current = 1;

    } catch (error) {

      console.error("Failed fetching api.", error);

    }
  }

  const handleViewMore = async () => {
    const nextPageNum = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPageNum)
      setRecipes([...recipes, ...nextRecipes.results])
      pageNumber.current = nextPageNum;
    } catch (error) {
      console.error(error);
    }
  }

  const addFavRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavRecipe(recipe);
      setfavouriteRecipes([...favouriteRecipes, recipe])
    } catch (error) {
      console.error(error);
    }
  }

  const removeFavRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavRecipe(recipe);
      const updateRecipe = favouriteRecipes.filter((favRecipe) => recipe.id !== favRecipe.id)
      setfavouriteRecipes(updateRecipe);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="tabs">
        <h1 onClick={() => setSelectedTab("search")}>Recipe Search</h1>
        <h1 onClick={() => setSelectedTab("favrourites")}>Favourites</h1>
      </div>
      {selectesTab === "search" && (
        <>      <form action="" onSubmit={(event) => handleSearchSubmit(event)}>
          <input
            type="text"
            required placeholder="Enter a search term...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button >Submit</button>

        </form>
          {recipes.map((recipe) => {
            const isFav = favouriteRecipes.some((favRecipe) => recipe.id === favRecipe.id);
            return (
              <RecipeCard
                recipe={recipe}
                onclick={() => setSelectedRecipe(recipe)}
                onFavBtnClick={isFav ? removeFavRecipe :  addFavRecipe }
                isFav={isFav}
              />
            );
          })}
          <button onClick={handleViewMore}>View More Recipes</button>
        </>
      )}

      {
        selectesTab === "favrourites" && (
          <div>
            {favouriteRecipes.map((recipe) => (
              <RecipeCard
                recipe={recipe}
                onclick={() => setSelectedRecipe(recipe)}
                onFavBtnClick={() => removeFavRecipe(recipe)}
                isFav={true}

              />
            ))}
          </div>
        )
      }
      {selectedRecipe ? <RecipeModal recipeId={selectedRecipe.id.toString()} onClose={() => setSelectedRecipe(undefined)} /> : null}
    </div>
  )
}

export default RecipeSearchFunctionality;