# Leaflet Editor

Here is an react library to overcome some disadvantages of current available editors of leaflet
1. You can add points to linestring
2. You can add ability to not to delete endpoints of linestring
3. You can drag intersection points to linestring
4. You can remove middle markers of linestring

### Installing

#### Install Leaflet-Linestring-editor by following command
```
npm install leaflet-linestring-editor --save
```
#### Install Manually

Download
[`leaflet-geoman.css`](https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.css) and
[`leaflet-geoman.min.js`](https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.min.js)
and include them in your project.

#### Include via CDN

CSS

<!-- prettier-ignore -->
```html
<link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.css" />
```

JS

```html
<script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.min.js"></script>
```

#### Include as ES6 Module

```js
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
```
## Getting Started

#### import in react component
import EditableGeometry from 'leaflet-editor-try/dist/EditableGeometry'

#### You have to pass geojson and leaflet map object as props and others props are optional
initialize your leaflet map and then pass it as prop
```html
{this.map ? <EditableGeometry map={this.map} feature={this.feature} geoJsonLayerOptions={geoJsonLayerOptions}></EditableGeometry>:null}
```
see the example for more info

See the available options in the table below.

| Option        | Default     | Description                                                                                      |
| :------------ | :---------- | :----------------------------------------------------------------------------------------------- |
| style           |                 | style of the linestring to be displayed can refer to leaflet docs                          |
| canAddPoints    | `true`          | can add new points by double clicking on line                                              |
| canDragIntersection   | `true`    | intersected markers can be dragged together                                                |
| canDeleteEndPoints | `false`      | to avoid deleting end points as well as intersection points                                |
| removeMiddleMarkers | `false`     | to remove middle markers added by geoman library                                           |


## Example
```
import React from 'react';
import ReactDOM from 'react-dom'
import logo from './logo.svg';
import './App.css';
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

```

## Built With

* [Create React App](https://github.com/geoman-io/leaflet-geoman) 
* [Leaflet](https://leafletjs.com/)
* [Leaflet-Geoman](https://github.com/geoman-io/leaflet-geoman) 

## Authors

* **Prasad Kulkarni** - (https://github.com/prasad5795) (kulkarniprasad57@gmail.com)

### Feature Request

I'm adopting the Issue Management of lodash which means, feature requests get the "Feature Request" Label and then get closed.
You can upvote existing feature requests (or create new ones). Upvotes make me see how much a feature is requested and prioritize their implementation.
Please see the existing [Feature Requests here](https://github.com/prasad5795/leaflet-linestring-editor/issues) and upvote if you want them to be implemented.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
