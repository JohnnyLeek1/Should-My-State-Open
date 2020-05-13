import React from 'react';

export default function StateCard(props) {
  var moment = require('moment');
  const state_name = props.data[0];
  const state_data = props.data[1];

  const most_recent_date = moment(state_data.most_recent_date, 'MM-DD-YYYY');
  const prior_date = moment(state_data.most_recent_date, 'MM-DD-YYYY').subtract(14, "days");
  return (
      <div className="state-card" onClick={() => window.location.href =`/${state_name}`}>
        <div className="card-contents">
          <h3 className="state-title">{state_name.toUpperCase()}</h3>
          <h4 className={`should-open-text ${state_data.should_open ? 'yes' : 'no'}`}>
            {state_data.should_open ? 'YES' : 'NO'}
          </h4>

          <h4>
            14 days ago ({prior_date.format('MM-DD-YYYY')}): <span className="before_cases">{state_data.beginning_cases.toLocaleString()} active cases</span>
          </h4>
          <h4>
            Now ({most_recent_date.format('MM-DD-YYYY')}): <span className="today_cases">{state_data.end_cases.toLocaleString()} active cases</span>
          </h4>
          <h4>
            Net Change (cases): <span className={`net_change ${state_data.net_case_change <= 0 ? 'yes' : 'no'}`}>{state_data.net_case_change.toLocaleString()} cases</span>
          </h4>
          <h4>
            Hospital Capacity: <span className="hospital_capacity">{state_data.total_hospital_capacity.toLocaleString()} beds</span>
          </h4>
          <h4>
            Total Tests: <span className="total_tests">{state_data.total_tests.toLocaleString()} tests</span>
          </h4>
        </div>
      </div>
  );

}
