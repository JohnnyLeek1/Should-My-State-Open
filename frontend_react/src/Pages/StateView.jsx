import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * The page for each individual state.
 * Shows more in depth detail about each
 * state.
 */
export default function StateView({ data }) {

  /**
   * Capitalizes each word in a string
   * @param {string} string - The string to capitalize
   * @return A capitalized string
   */
  const capitalize = (string) => {
    let words = string.split(' ');
    words.forEach((word, index) => {
      words[index] = word.toLowerCase();
      words[index] = word[0].toUpperCase() + word.slice(1);
    });
    return words.join(' ');
  }

  /* Get the state from the URL Parameter */
  let { state } = useParams();
  state = state.toLowerCase();

  /* Capitalize the state name */
  let readableStateName = capitalize(state)

  /* Detect if the selected state actually exists */
  let stateFound = (state.toLowerCase() in data)



  /**
   * Small panel that is rendered if the selected state cannot
   * be found
   */
  const NotFoundPanel = () => {
    return (
      <div id="not-found-panel">
        <h1 className="page-title">Couldn't find { readableStateName }</h1>

        <a href="/">Go back?</a>
      </div>
    );
  }

  const check = <>&#x2713;</>
  const close = <>&#x2715;</>

  /**
   * Large panel that reneders the data for the given state
   */
  const StateData = () => {
    return (
      <div id="state-view-panel">
        <div className="panel-contents">
          <h1 className="panel-title">
            { readableStateName }:
            <span className={`${data[state].should_open ? 'yes' : 'no'}`}>
              {data[state].should_open ? 'YES' : 'NO'}
            </span>
          </h1>
          <p>
            Based off of the&nbsp;
            <a href="https://www.whitehouse.gov/openingamerica/" rel="noopener noreferrer" target="_blank" title="White House Guidelines for Reopening America">White House Guidelines</a>
            &nbsp;and the data we have collected, {readableStateName} should {data[state].should_open ? '' : 'NOT '}
            be allowed to open.
          </p>
          <p>
            Here's why:
          </p>
          <ul className="panel-list">
            <li className={`${data[state].downward_cases === true ? 'yes' : 'no'}`}>
              {data[state].downward_cases === true ? check : close}&nbsp;
              Downward Trajectory of documented cases within 14 day period.
              <ul className="panel-list nested">
                <li className="text">
                  {readableStateName} has had an {data[state].downward_cases === true ? 'decreasing ' : 'increasing '}
                   trend over the last 14 days. A net {data[state].downward_cases === true ? 'decrease ' : 'increase '} of:&nbsp;
                   <span className={`${data[state].net_case_change <= 0 ? 'yes' : 'no'}`}>{data[state].net_case_change.toLocaleString()}</span>
                   &nbsp;cases
                </li>
              </ul>
            </li>
          </ul>
          <p className="nested">-OR-</p>
          <ul className="panel-list">
            <li className={`${data[state].enough_tests === true ? 'yes' : 'no'}`}>
              {data[state].enough_tests === true ? check : close}&nbsp;
              Downward Trajectory of positive tests within 14 day period. (With a
              flat or increasing volume of tests)
              <ul className="panel-list nested">
                <li className="text">
                  {readableStateName} has had a total of {data[state].total_tests.toLocaleString()} tests.
                  {
                    data[state].enough_tests
                    ? ' These tests have been at an increasing/constant volume whilst the total number of active cases has decreased.'
                    : ' These tests have been at an insatisfactory volume or the number of positive tests has been increasing.'
                }
                </li>
              </ul>
            </li>
          </ul>
          <p>-AND-</p>
          <ul className="panel-list">
            <li className={`${data[state].enough_hospital_capacity === true ? 'yes' : 'no'}`}>
              {data[state].enough_hospital_capacity === true ? check : close}&nbsp;
              Be able to treat all patients WITHOUT crisis care.
              <ul className="panel-list nested">
                <li className="text">
                  {readableStateName} has {data[state].total_hospital_capacity.toLocaleString()} hospital beds
                  and {data[state].end_cases.toLocaleString()} current active cases.
                </li>
              </ul>
            </li>
          </ul>
          <p>-AND-</p>
          <ul className="panel-list">
            <li className={`${data[state].downward_cases === true ? 'yes' : 'no'}`}>
              {data[state].downward_cases === true ? check : close}&nbsp;
              Downward Trajectory of Covid/Flu-like illness symptoms within a 14
              day period.
              <ul className="panel-list nested">
                <li className="text">
                  {readableStateName} has had a {data[state].downward_cases === true ? 'decreasing ' : 'increasing/constant '}
                  trend of covid/flu-like symptoms over the last 14 days.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  /* Decide whether to render the not found panel or the state panel */
  return (
    <>
    { stateFound === false ? <NotFoundPanel/> : <StateData/>}
    </>
  );

}
