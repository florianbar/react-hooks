import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    fetch("https://react-hooks-flo.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = id => {
    fetch(
      `https://react-hooks-flo.firebaseio.com/ingredients/${id}.json/`, 
      {
        method: "DELETE"    
      }
    ).then(response => {
      setUserIngredients(prevIngredients => prevIngredients.filter(item => item.id !== id));
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
};

export default Ingredients;
