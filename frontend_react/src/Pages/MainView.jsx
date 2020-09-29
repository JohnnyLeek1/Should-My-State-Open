import React, { useState } from 'react';

import StateCard from '../Components/StateCard';

export default function MainView(props) {

    const [filterInput, setFilterInput] = useState('');

    const getTotalOpenStates = Object.entries(props.data).filter(element => element[1].should_open).length;

    const currentStates = Object.entries(props.data).filter(state => filterInput.toLowerCase() === '' || state[0].toLowerCase().includes(filterInput.toLowerCase()))
                                                    .map(state => state);

    const handleFilterChange = e => setFilterInput(e.target.value);
    return (
        <>
            <h1 className="page-title">Which States Should Open Up?</h1>
            <h2 className="page-subtitle no-margin">Click on a state for more information.</h2>

            <h2 className="page-subtitle">Currently: <span className="technically">{getTotalOpenStates}/51</span> states meet the guidelines to open.</h2>

            <div id="filter-container">
                <input className="text-input" type="text" value={filterInput} placeholder="Enter state..." onChange={handleFilterChange} autoComplete="off"/>
            </div>

            <div className="state-card-container">
                { currentStates.map(state => <StateCard key={state} data={state}/>) }
            </div>

            {currentStates.length === 0 ? <h1 className="page-title">No Results Found</h1> : ''}
        </>
    );
}
