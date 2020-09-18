import React, { useState, useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET": 
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter(item => item.id !== action.id);
    default:
      return currentIngredients;
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  //const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: "SET", ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);

    fetch("https://react-hooks-flo.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(responseData => {
        setIsLoading(false);
        dispatch({
          type: "ADD", 
          ingredient: { id: responseData.name, ...ingredient }
        });
      });
  };

  const removeIngredientHandler = id => {
    setIsLoading(true);

    fetch(`https://react-hooks-flo.firebaseio.com/ingredients/${id}.json/`, { 
      method: "DELETE" 
    })
      .then(response => {
        setIsLoading(false);
        dispatch({type: "DELETE", id: id});
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={isLoading} 
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={removeIngredientHandler} 
        />
      </section>
    </div>
  );
};

export default Ingredients;
