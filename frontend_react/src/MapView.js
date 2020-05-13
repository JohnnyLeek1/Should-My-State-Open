import React, { useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";

export default function MapView(props) {

  const get_total_open_states = Object.entries(props.data).filter(element => element[1].should_open).length;

  useEffect(() => {
    let map = am4core.create("map-container", am4maps.MapChart);
    map.geodata = am4geodata_usaLow;
    map.projection = new am4maps.projections.AlbersUsa();

    let mapGeoData = map.series.push(new am4maps.MapPolygonSeries());
    mapGeoData.useGeodata = true;

    let mapTemplate = mapGeoData.mapPolygons.template;
    mapTemplate.tooltipText = "{name}: {open}";
    mapTemplate.fill = am4core.color("#333");

    mapTemplate.events.on("hit", (e) => {
      window.location.href=`/${e.target.dataItem.dataContext.name}`;
    });

    let state_data = [];
    Object.entries(props.data)
      .map(state => state_data.push({
         "id": `US-${state[1].state_code.toUpperCase()}`,
         "fill": state[1].should_open ? am4core.color('#8ACB88') : am4core.color('#D92328'),
         "open": state[1].should_open ? 'Can Open' : 'Should not open'
       }));
    mapGeoData.data = state_data;
    mapTemplate.propertyFields.fill = "fill";
  }, [props.data]);

  return (
    <>
    <div id="map-view-container">
      <h1 className="page-title">Map View</h1>
      <h2 className="page-title">Currently: <span className="technically">{get_total_open_states}/51</span> states meet the guidelines to open.</h2>
      <div id="map-container"></div>
    </div>
    </>
  );

}
