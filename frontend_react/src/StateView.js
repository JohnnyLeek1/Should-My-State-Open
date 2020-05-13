import React from 'react';
import { useParams } from 'react-router-dom';

export default function StateView(props) {
  const capitalize = (string) => {
    let words = string.split(' ');
    words.forEach((word, index) => {
      words[index] = word.toLowerCase();
      words[index] = word[0].toUpperCase() + word.slice(1);
    });
    return words.join(' ');
  }

  let { state } = useParams();
  state = state.toLowerCase();

  let readableStateName = capitalize(state)

  let stateFound = (state.toLowerCase() in props.data)



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

  const StateData = () => {
    return (
      <div id="state-view-panel">
        <div className="panel-contents">
          <h1 className="panel-title">
            { readableStateName }:
            <span className={`${props.data[state].should_open ? 'yes' : 'no'}`}>
              {props.data[state].should_open ? 'YES' : 'NO'}
            </span>
          </h1>
          <p>
            Based off of the&nbsp;
            <a href="https://www.whitehouse.gov/openingamerica/" rel="noopener noreferrer" target="_blank" title="White House Guidelines for Reopening America">White House Guidelines</a>
            &nbsp;and the data we have collected, {readableStateName} should {props.data[state].should_open ? '' : 'NOT '}
            be allowed to open.
          </p>
          <p>
            Here's why:
          </p>
          <ul className="panel-list">
            <li className={`${props.data[state].downward_cases === true ? 'yes' : 'no'}`}>
              {props.data[state].downward_cases === true ? check : close}&nbsp;
              Downward Trajectory of documented cases within 14 day period.
              <ul className="panel-list nested">
                <li className="text">
                  {readableStateName} has had an {props.data[state].downward_cases === true ? 'decreasing ' : 'increasing '}
                   trend over the last 14 days. A net {props.data[state].downward_cases === true ? 'decrease ' : 'increase '} of:&nbsp;
                   <span className={`${props.data[state].net_case_change <= 0 ? 'yes' : 'no'}`}>{props.data[state].net_case_change.toLocaleString()}</span>
                   &nbsp;cases
                </li>
              </ul>
            </li>
          </ul>
          <p className="nested">-OR-</p>
          <ul className="panel-list">
            <li className={`${props.data[state].enough_tests === true ? 'yes' : 'no'}`}>
              {props.data[state].enough_tests === true ? check : close}&nbsp;
              Downward Trajectory of positive tests within 14 day period. (With a
              flat or increasing volume of tests)
              <ul className="panel-list nested">
                <li className="text">
                  {readableStateName} has had a total of {props.data[state].total_tests.toLocaleString()} tests.
                  {
                    props.data[state].enough_tests
                    ? ' These tests have been at an increasing/constant volume whilst the total number of active cases has decreased.'
                    : ' These tests have been at an insatisfactory volume or the number of positive tests has been increasing.'
                }
                </li>
              </ul>
            </li>
          </ul>
          <p>-AND-</p>
          <ul className="panel-list">
            <li className={`${props.data[state].enough_hospital_capacity === true ? 'yes' : 'no'}`}>
              {props.data[state].enough_hospital_capacity === true ? check : close}&nbsp;
              Be able to treat all patients WITHOUT crisis care.
              <ul className="panel-list nested">
                <li className="text">
                  {readableStateName} has {props.data[state].total_hospital_capacity.toLocaleString()} hospital beds
                  and {props.data[state].end_cases.toLocaleString()} current active cases.
                </li>
              </ul>
            </li>
          </ul>
          <p>-AND-</p>
          <ul className="panel-list">
            <li className={`${props.data[state].downward_cases === true ? 'yes' : 'no'}`}>
              {props.data[state].downward_cases === true ? check : close}&nbsp;
              Downward Trajectory of Covid/Flu-like illness symptoms within a 14
              day period.
              <ul className="panel-list nested">
                <li className="text">
                  {readableStateName} has had a {props.data[state].downward_cases === true ? 'decreasing ' : 'increasing/constant '}
                  trend of covid/flu-like symptoms over the last 14 days.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <>
    { stateFound === false ? <NotFoundPanel/> : <StateData/>}
    </>
  );

}
