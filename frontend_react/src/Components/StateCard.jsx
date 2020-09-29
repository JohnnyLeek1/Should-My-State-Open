import React from 'react';

export default function StateCard(props) {
  const moment = require('moment');
  const stateName = props.data[0];
  const stateData = props.data[1];

  const most_recent_date = moment(stateData.most_recent_date, 'MM-DD-YYYY');
  const prior_date = moment(stateData.most_recent_date, 'MM-DD-YYYY').subtract(14, "days");
  return (
      <div className="state-card" onClick={() => window.location.href =`/${stateName}`}>
        <div className="card-contents">
          <h3 className="state-title">{stateName.toUpperCase()}</h3>
          <h4 className={`should-open-text ${stateData.should_open ? 'yes' : 'no'}`}>
            {stateData.should_open ? 'YES' : 'NO'}
          </h4>

          <h4>
            14 days ago ({prior_date.format('MM-DD-YYYY')}): <span className="before_cases">{stateData.beginning_cases.toLocaleString()} active cases</span>
          </h4>
          <h4>
            Now ({most_recent_date.format('MM-DD-YYYY')}): <span className="today_cases">{stateData.end_cases.toLocaleString()} active cases</span>
          </h4>
          <h4>
            Net Change (cases): <span className={`net_change ${stateData.net_case_change <= 0 ? 'yes' : 'no'}`}>{stateData.net_case_change.toLocaleString()} cases</span>
          </h4>
          <h4>
            Hospital Capacity: <span className="hospital_capacity">{stateData.total_hospital_capacity.toLocaleString()} beds</span>
          </h4>
          <h4>
            Total Tests: <span className="total_tests">{stateData.total_tests.toLocaleString()} tests</span>
          </h4>
        </div>
      </div>
  );

}
