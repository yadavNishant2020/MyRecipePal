import { FormEvent, useState, useRef, useEffect } from "react";
import * as api from '../api'
import { Recipe } from "../types";
import { RecipeCard } from "./ReceipeCard";
import RecipeModal from "./RecipeModal";

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

    <div className="h-auto p-8 bg-black bg-opacity-60 flex flex-col items-center">
      <div className="text-center  text-white text-[4rem] md:text-4xl lg:text-5xl my-3  font-black">
        <p>Find all the Recipes in just One Click </p>
      </div>
      <div className="flex justify-center my-9 ">
        <div className="flex justify-center items-center gap-6  bg-green-200 bg-opacity-65 w-[320px] py-3 rounded-sm">
          <h1 className={`cursor-pointer ${selectesTab === "search" ? "bg-white text-green-600 p-3 rounded-sm  tracking-wider text-lg font-bold" : "bg-green-600  text-white bg-opacity-65 hover:bg-opacity-100  p-3 rounded-sm font-thin tracking-wider text-md "}`} onClick={() => setSelectedTab("search")}>Recipe Search</h1>
          <h1 className={`cursor-pointer ${selectesTab === "favrourites" ? " bg-white text-green-600  p-3 rounded-sm font-semibold tracking-wider text-lg" : "bg-green-600  text-white bg-opacity-65 hover:bg-opacity-100  p-3 rounded-sm font-thin tracking-wider text-md"}`} onClick={() => setSelectedTab("favrourites")}>Favourites</h1>
        </div>
      </div>

      {selectesTab === "search" && (
        <>
          <form action="" onSubmit={(event) => handleSearchSubmit(event)} className="mb-9">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-green-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input
                type="text"
                required
                placeholder="Enter recipe keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 p-2 border rounded "
              />

              <button className="p-2 ml-2 text-white bg-green-600 hover:bg-green-400 rounded">Search Recipes</button>
            </div>
          </form>
          <div className="flex flex-wrap justify-around gap-5">
            {recipes.map((recipe) => {
              const isFav = favouriteRecipes.some((favRecipe) => recipe.id === favRecipe.id);
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onclick={() => setSelectedRecipe(recipe)}
                  onFavBtnClick={isFav ? removeFavRecipe : addFavRecipe}
                  isFav={isFav}
                />
              );
            })}
          </div>
          <button onClick={handleViewMore} className="p-2 mt-5 hover:bg-green-500 text-white bg-green-600 font-thin rounded">View More</button>
        </>
      )}

      {selectesTab === "favrourites" && (
          <div className="flex flex-wrap justify-around gap-5">
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onclick={() => setSelectedRecipe(recipe)}
              onFavBtnClick={() => removeFavRecipe(recipe)}
              isFav={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe ? <RecipeModal recipeId={selectedRecipe.id.toString()} onClose={() => setSelectedRecipe(undefined)} /> : null}
    </div>
  )
}

export default RecipeSearchFunctionality;