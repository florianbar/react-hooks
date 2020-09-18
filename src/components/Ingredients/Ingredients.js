import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

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

const Ingredients = () => {
  const [userIngredients, dispatchIngredients] = useReducer(ingredientReducer, []);
  const { 
    isLoading, 
    data, 
    error, 
    sendRequest, 
    requestExtra, 
    identifier, 
    clear 
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error) {
      if (identifier === "REMOVE_INGREDIENT") {
        dispatchIngredients({type: "DELETE", id: requestExtra });
      } 
      else if (identifier === "ADD_INGREDIENT") {
        dispatchIngredients({type: "ADD", ingredient: { id: data.name, ...requestExtra } });
      }
    }
  }, [data, requestExtra, identifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatchIngredients({type: "SET", ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      `https://react-hooks-flo.firebaseio.com/ingredients.json`, 
      "POST",
      JSON.stringify(ingredient),
      ingredient,
      "ADD_INGREDIENT"
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(id => {
    sendRequest(
      `https://react-hooks-flo.firebaseio.com/ingredients/${id}.json`, 
      "DELETE",
      null,
      id,
      "REMOVE_INGREDIENT"
    );
  }, [sendRequest]);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
        ingredients={userIngredients} 
        onRemoveItem={removeIngredientHandler} 
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredientHandler} 
        loading={isLoading} 
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
