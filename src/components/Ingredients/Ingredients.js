import React, { useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (ingredientsState, action) => {
  switch (action.type) {
    case "SET": 
      return action.ingredients;
    case "ADD":
      return [...ingredientsState, action.ingredient];
    case "DELETE":
      return ingredientsState.filter(item => item.id !== action.id);
    default:
      return ingredientsState;
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND": 
      return {isLoading: true, error: null};
    case "RESPONSE": 
      return {...httpState, isLoading: false};
    case "ERROR": 
      return {isLoading: false, error: action.error};
    case "CLEAR": 
      return {...httpState, error: null};
    default:
      return httpState;
  }
};

const Ingredients = () => {
  const [userIngredients, dispatchIngredients] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { 
    isLoading: false, 
    error: null 
  });

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatchIngredients({type: "SET", ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = ingredient => {
    dispatchHttp({type: "SEND"});

    fetch("https://react-hooks-flo.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(responseData => {
        dispatchHttp({type: "RESPONSE"});
        dispatchIngredients({
          type: "ADD", 
          ingredient: { id: responseData.name, ...ingredient }
        });
      });
  };

  const removeIngredientHandler = id => {
    dispatchHttp({type: "SEND"});

    fetch(`https://react-hooks-flo.firebaseio.com/ingredients/${id}.json/`, { 
      method: "DELETE" 
    })
      .then(response => {
        dispatchHttp({type: "RESPONSE"});
        dispatchIngredients({type: "DELETE", id: id});
      })
      .catch(error => {
        dispatchHttp({type: "ERROR", error: error.message});
      });
  };

  const clearError = () => {
    dispatchHttp({type: "CLEAR"});
  };

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={httpState.isLoading} 
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
