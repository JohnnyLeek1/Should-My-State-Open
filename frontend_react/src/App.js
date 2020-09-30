import React, { useState, useEffect } from 'react';

/* React Router */
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

/* Component Imports */
import LoadingIcon from './Components/LoadingIcon';

/* Page Imports */
import MainView from './Pages/MainView';
import MapView from './Pages/MapView';
import StateView from './Pages/StateView';
import Sources from './Pages/Sources';

/* Firebase Imports */
import { setData } from './Components/Firebase';

/**
 *  Main Entry Point. Houses navbar, and React Router.
 */
export default function App() {

    /**
     * State declarations:
     *  isLoading: Whether or not the page is loading
     *  updatedDate: The date that the app was updated
     *  stateDate: JSON object containing COVID data for each state
     */
    const [isLoading, setIsLoading] = useState(true);
    const [updatedDate, setUpdatedDate] = useState(new Date());
    const [stateData, setStateData] = useState({});

    /**
     * Grab the data from firebase and set states appropriately
     */
    useEffect(() => {
        setData(setUpdatedDate, setStateData)
        .then(setIsLoading(false))
        .finally(console.log(stateData))
    }, []);

    /**
     * If page is NOT loading, render the page, else render
     * a loading icon
     */
    if (!isLoading) {
        return (
           <Router>
            <nav className="navbar">
              <ul className="navbar-nav">
                <li className="nav-brand">
                  <NavLink to="/" className="nav-link nav-active">
                    <span className="material-icons nav_logo">home</span>
                    <span className="link-text brand-text">SHOULD MY STATE OPEN</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" activeClassName="nav-active" exact={true}>
                    <span className="material-icons">public</span>
                    <span className="link-text">State List</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/map" className="nav-link" activeClassName="nav-active" exact={true}>
                    <span className="material-icons">map</span>
                    <span className="link-text">Map View</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/sources" className="nav-link" activeClassName="nav-active">
                    <span className="material-icons">info</span>
                    <span className="link-text">Info/Sources</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <a href="https://github/johnnyleek1/should-my-state-open" target="_blank" rel="noopener noreferrer" className="nav-link">
                    <span className="material-icons">sentiment_satisfied</span>
                    <span className="link-text">Made by Johnny Leek</span>
                  </a>
                </li>
              </ul>
            </nav>
            <div id="page-content">
            <div id="last-updated-container">
              <p>Last Updated:</p>
              <p>{ updatedDate.toLocaleString() }</p>
            </div>
            <Switch>
              <Route path="/map">
                <MapView data={stateData}/>
              </Route>
              <Route path="/sources">
                <Sources/>
              </Route>
              <Route path="/:state">
                <StateView data={stateData}/>
              </Route>
              <Route exact path="/">
                <MainView data={stateData}/>
              </Route>
            </Switch>
            </div>
          </Router>
        );
    } else {
        return <LoadingIcon/>
    }

}
