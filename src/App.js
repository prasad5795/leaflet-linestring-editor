import React from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';
// import EditableGeometry from './dist/EditableGeometry'
import EditableGeometry from 'leaflet-editor-try/dist/EditableGeometry'
import L from 'leaflet'

class App extends React.Component {
  componentDidMount() {
    this.map = this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(this.map);

    this.feature = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f0da",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.267764, 48.684605],
            [-3.265329, 48.683851]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }, {
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f0db",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.265329, 48.683851],
            [-3.265285, 48.684035],
            [-3.265092, 48.684377],
            [-3.264302, 48.685239]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }, {
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f11b",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.265329, 48.683851],
            [-3.264471, 48.683738]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }, {
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f0b9",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.264302, 48.685239],
            [-3.263853, 48.685019],
            [-3.263599, 48.684827],
            [-3.262987, 48.68482],
            [-3.262161, 48.685286]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }, {
        "type": "Feature",
        "id": "00004632-3200-0400-0000-00000060f103",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [-3.262161, 48.685286],
            [-3.261748, 48.684993],
            [-3.261225, 48.68435]
          ]
        },
        "properties": {
          "graph_id": 12,
          "type": "proposed_mds"
        }
      }]
    }

    this.forceUpdate()
  }

  render() {
    let geoJsonLayerOptions = {
      style: {
        color: 'red',
        weight: 7
      },
      canAddPoints:true,
      canDeleteEndPoints:false,
      canDragIntersection:true,
      removeMiddleMarkers:false
    }
    
    return (
      <React.Fragment>
        <div id="map" className="map-container" style={{ height: window.screen.height, width: window.screen.width, overflow: 'hidden', overflowY: 'hidden' }}></div>
        {this.map ? <EditableGeometry map={this.map} feature={this.feature} geoJsonLayerOptions={geoJsonLayerOptions}></EditableGeometry> : null}
      </React.Fragment>
    );
  }

}

export default App;
