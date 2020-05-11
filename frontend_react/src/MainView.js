import React, { useState } from 'react';

import StateCard from './StateCard';

export default function MainView(props) {

  const [filterInput, setFilterInput] = useState('');

  const get_total_open_states = Object.entries(props.data).filter(element => element[1].should_open).length;

  const states = Object.entries(props.data).filter(state => filterInput.toLowerCase() === '' || state[0].toLowerCase().includes(filterInput.toLowerCase()))
                                            .map(state => state)

  const filterStates = e => {
    setFilterInput(e.target.value);
  }

  return (
    <>
      <h1 className="page-title">Which States Should Open Up?</h1>
      <h2 className="page-subtitle no-margin">Click on a state for more information.</h2>

      <h2 className="page-subtitle">Currently: <span className="technically">{get_total_open_states}/51</span> states meet the guidelines to open.</h2>

      <div id="filter-container">
        <input className="text-input" type="text" value={filterInput} placeHolder="Enter State..." onChange={filterStates} autoComplete="off"/>
      </div>

      <div className="state-card-container">
        {states.map((state) => {
          return <StateCard key={state} data={state}/>
        })}
      </div>

      {states.length === 0 ? <h1 className="page-title">No Results Found</h1> : ''}
    </>
  );

}
