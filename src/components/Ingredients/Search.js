import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [filter, setFilter] = useState("");
  const {onLoadIngredients} = props;
  const inputElementRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filter === inputElementRef.current.value) {
        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
        fetch('https://react-hooks-flo.firebaseio.com/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            console.log(responseData);
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    
    //clean-up old effect and run new one
    return () => {
      clearTimeout(timer);
    };
  }, [filter, onLoadIngredients, inputElementRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputElementRef}
            type="text" 
            value={filter} 
            onChange={event => setFilter(event.target.value)} 
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
