import React from 'react';

export default function Sources() {
  return (
    <div id="sources-panel">
      <div className="panel-contents">
        <h1 className="panel-title">Sources / Info</h1>
        <p>
        Guidelines from <a href="https://www.whitehouse.gov/openingamerica/" rel="noopener noreferrer" target="_blank" title="White House Guidelines for Reopening America">https://www.whitehouse.gov/openingamerica/</a>
        </p>
        <p>
        Data is collected daily at 12AM from John Hopkins University. Due to the
        upload schedule of this data, it will always be 1 day behind. There isn't
        much I can do about this, unless I sacrafice accuracy. JHU has proven
        themselves to be an extremely reputable source, and so I decided to opt
        for using the late but accurate data as opposed to early, inaccurate data.
        </p>
        <p>
        Other notes about the data:
        </p>
        <ul className="panel-list">
          <li>
            - Data source: <a href="https://github.com/CSSEGISandData/COVID-19" rel="noopener noreferrer" target="_blank" title="GitHub Repository Containing COVID-19 Data">https://github.com/CSSEGISandData/COVID-19</a>
          </li>
          <li>
            - Data is assumed to be accurate. Confirmed cases include presumptive
            positive cases
          </li>
          <li>
            - A positive test is counted as an active case (and vise-versa)
          </li>
          <li>
            - Only data from the mainland 48 states, Alaska, Hawaii, and D.C is parsed and
              calculated
          </li>
          <li>
            - A "Downward Trajectory of Covid/Flu-like illness symptoms within a 14
              day period." is considered equal to the decrease in reported active
              cases over this period, as this data is volatile and difficult to
              prove
          </li>
        </ul>
        <br/><br/>
        <p>
          This website (nor its author) hold absolutely no political bias
          one way or another. The information provided here is based on objective
          facts. The information sources are provided above, and the source code
          for the data collection agent can also be found on this website to
          ensure that no bias is implemented in the creation of these numbers.
        </p>
        <br/>
        <p>
          This website was created by Johnny Leek, a freshman Computer Science
          student, as a weekend project. You can check out my other projects&nbsp;
          <a href="https://johnnyleek.dev" rel="noopener noreferrer" target="_blank" title="Author's Website">here</a>.
        </p>
      </div>
    </div>
  );
}
