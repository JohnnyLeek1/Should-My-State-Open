import React from 'react';

export default function LoadingIcon() {
  return (
    <div id="loading-container">
      <h1>Please Wait...</h1>
      <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" r="16.2965" fill="none" stroke="#593196" strokeWidth="2">
          <animate attributeName="r" repeatCount="indefinite" dur="1s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.5s"></animate>
          <animate attributeName="opacity" repeatCount="indefinite" dur="1s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.5s"></animate>
        </circle>
        <circle cx="50" cy="50" r="35.0882" fill="none" stroke="#2c184a" strokeWidth="2">
          <animate attributeName="r" repeatCount="indefinite" dur="1s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline"></animate>
          <animate attributeName="opacity" repeatCount="indefinite" dur="1s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline"></animate>
        </circle>
      </svg>
    </div>
  );
}
