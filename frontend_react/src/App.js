import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from 'react-router-dom';

import MainView from './MainView';
import StateView from './StateView';
import MapView from './MapView';
import Sources from './Sources';

function App() {
  const state_data = require('./compiled_data.json');
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
            <a href="https://gitlab.com/johnnyleek/should-my-state-open" target="_blank" rel="noopener noreferrer" className="nav-link">
              <span className="material-icons">sentiment_satisfied</span>
              <span className="link-text">Made by Johnny Leek</span>
            </a>
          </li>
        </ul>
      </nav>
      <div id="page-content">
      <div id="last-updated-container">
        <p>Last Updated:</p>
        <p>{state_data['alabama'].most_recent_date}</p>
      </div>
      <Switch>
        <Route path="/state/:state">
          <StateView data={state_data}/>
        </Route>
        <Route path="/map">
          <MapView data={state_data}/>
        </Route>
        <Route path="/sources">
          <Sources/>
        </Route>
        <Route exact path="/">
          <MainView data={state_data}/>
        </Route>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
