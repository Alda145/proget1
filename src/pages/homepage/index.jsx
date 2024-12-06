import Search from "../../components/search"
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import './styles.css'
import RecipeItem from "../../components/recipe-item";
import FavoriteItem from "../../components/favorite-item";
import { useContext } from "react";
import { ThemeContext } from "../../App";

const reducer = (state, action) => {

    switch (action.type) {
        case "filterFavorites":
            console.log(action)
            return {
                ...state,
                filteredValue: action.value
            }


        default:
            return state;
    }
}


const initialState = {
    filteredValue: ''
}

const Homepage = () => {
    //loading state
    const [isLoading, setIsLoading] = useState(false);


    //save results that we recive from api
    const [recipies, setRecipies] = useState([])

    //favorite state
    const [favorites, setFavorites] = useState([]);

    //state for api is success or not 
    const [apiCalledSuccess, setApiCalledSuccess] = useState(false);

    //Use reducer fancunality
    const [filteredState, dispatch] = useReducer(reducer, initialState)

    // Use context
    const { theme } = useContext(ThemeContext);

    useEffect(() => {

        const extractFavoritesFromLOcalStorageOnPageLoad = JSON.parse(localStorage.getItem('favorites'));
        //console.log(extractFavoritesFromLOcalStorageOnPageLoad);
        setFavorites(extractFavoritesFromLOcalStorageOnPageLoad);

    }, [])

    console.log(filteredState, 'filtered state');
    //filter the favorites
    const filteredFavoritesItems = favorites.filter(item => item.title.toLowerCase().includes(filteredState.filteredValue));





    const getDataFromSearchComponent = (getData) => {
        //keep the loading state as true before we are calling the api .
        setIsLoading(true);

        //console.log(getData, 'getdata')
        const getRecipies = async () => {
            const apiRequest = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=0b486e71c68f4b9c9a0e5430c2d4b447&query=${getData}`);
            const result = await apiRequest.json();
            const { results } = result;

            if (results && results.length > 0) {
                //set loading state as false again
                //set the recipies state;
                setIsLoading(false);
                setRecipies(results);
                setApiCalledSuccess(true);
            }


            // console.log('result is ', result);
        }
        getRecipies();

    }
    // console.log(isLoading, recipies, 'loading State,recipies ');

    const addToFavorites = useCallback((getCurrentRecipeItem) => {
        //console.log(getCurrentRecipeItem);
        let copyFavorites = [...favorites];
        const index = copyFavorites.findIndex((item) => item.id === getCurrentRecipeItem.id)
        // console.log(index);
        if (index === -1) {
            copyFavorites.push(getCurrentRecipeItem);
            setFavorites(copyFavorites);
            // save the favorites in local storage
            localStorage.setItem('favorites', JSON.stringify(copyFavorites));
            window.scrollTo({ top: "0", behavior: "smooth" });

        } else {
            alert('item is already present in favorites ');
        }

    }, [favorites])

    /*  const renderRecipies = useCallback(() => {
         if (recipies && recipies.length > 0) {
 
             return (recipies.map((item) => (
                 <RecipeItem
                     key={item.id}
                     addToFavorites={() => addToFavorites(item)}
                     id={item.id}
                     image={item.image}
                     title={item.title}
                 />
             ))
             )
         }
 
 
     }, [recipies, addToFavorites]) */



    /* const addToFavorites = (getCurrentRecipeItem) => {
 
         //console.log(getCurrentRecipeItem);
         let copyFavorites = [...favorites];
         const index = copyFavorites.findIndex((item) => item.id === getCurrentRecipeItem.id)
         // console.log(index);
         if (index === -1) {
             copyFavorites.push(getCurrentRecipeItem);
             setFavorites(copyFavorites);
             // save the favorites in local storage
             localStorage.setItem('favorites', JSON.stringify(copyFavorites));
 
         } else {
             alert('item is already present in favorites ');
         }
 
     }*/

    // console.log(favorites);
    const removeFromFavorites = (getCurrentId) => {
        let copyFavorites = [...favorites];
        copyFavorites = copyFavorites.filter((item) => item.id !== getCurrentId);
        setFavorites(copyFavorites);
        localStorage.setItem('favorites', JSON.stringify(copyFavorites));

    }




    return (
        <div className="homepage">
            <Search
                getDataFromSearchComponent={getDataFromSearchComponent}
                apiCalledSuccess={apiCalledSuccess}
                setApiCalledSuccess={setApiCalledSuccess}
            />
            {/* {show favorites items } */}
            <div className="favorites-wrapper" >
                <h1 className="favorites-title" style={theme ? { color: "#12343b" } : {}}>Favorites</h1>

                <div className="search-favorites" >
                    <input
                        name='searchfavorites'
                        placeholder="Search Favorites"
                        onChange={(event) => dispatch({ type: 'filterFavorites', value: event.target.value })}
                        value={filteredState.filteredValue}
                    />
                </div>

                <div className="favorites">
                    {!filteredFavoritesItems.length && <div style={{ display: "flex", width: '100%', justifyContent: "center" }} className="no-items">No favorites are found</div>}
                    {filteredFavoritesItems && filteredFavoritesItems.length > 0 ?
                        filteredFavoritesItems.map((item, index) => (
                            <FavoriteItem
                                removeFromFavorites={() => removeFromFavorites(item.id)}
                                key={item.id}
                                id={item.id || index}
                                image={item.image}
                                title={item.title}
                            />
                        ))
                        : null}
                </div>
            </div >
            {/*   {Show loading } */}
            {isLoading && <div className="loading" >Loading recipies Please wait ...</div>}
            {/*  {map through the recipies } */}
            <div className="items" >

                {/* {
                    renderRecipies()
                } */}
                {useMemo(
                    () =>
                        !isLoading && recipies && recipies.length > 0 ?
                            recipies.map((item) => (
                                <RecipeItem
                                    key={item.id}
                                    addToFavorites={() => addToFavorites(item)}
                                    id={item.id}
                                    image={item.image}
                                    title={item.title}
                                />
                            )) : null


                    , [isLoading, recipies, addToFavorites])}



                {/*  {recipies && recipies.length > 0 ?
                    recipies.map((item) => (
                        <RecipeItem
                            key={item.id}
                            addToFavorites={() => addToFavorites(item)}
                            id={item.id}
                            image={item.image}
                            title={item.title}
                        />
                    )) : null} */}
            </div>

            {!isLoading && !recipies.length && <div className="no-items"  >No recipies are found </div>}
        </div>
    )
}

export default Homepage