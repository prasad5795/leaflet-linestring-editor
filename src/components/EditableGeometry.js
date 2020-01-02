import React, { Component } from 'react'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import * as turf from '@turf/turf'
import PropTypes from 'prop-types';
import "./EditableGeometry.css"

export default class EditableGeometry extends Component {
    constructor(props) {
        super(props)
        this.draggingMarkerId = undefined;
        this.lead = undefined;
        this.lastDragEvent = undefined;
        this.markerDraggingStarted = false;
        this.endMarkers = {};
        this.mapOfMarkersWithSameCoords = {}
        this.markerToLineMapping = {}
        this.oldMarkers = [];
        this.operationExecuting = false;
        this.layerAddListener = undefined;
    }

    render() {
        try {
            this.lead = L.geoJSON(this.props.feature, this.props.geoJsonLayerOptions)
            this.lead.addTo(this.props.map).bringToFront()
            this.lead.pm.enable()
            this.props.map.fitBounds(this.lead.getBounds(), { maxZoom: 17 })
        } catch (error) {
            console.error(error)
        }
        return (
            <div></div>
        )
    }

    componentDidMount() {
        //take all the layers
        let layers = this.props.map._layers;
        let markers = []
        let lines = []
        let middleMarkers = []
        // extract markers(white balls) from all the layers and make an array of markers
        for (let key of Object.keys(layers)) {
            if (layers[key].options && layers[key].options.icon && layers[key].options.icon.options && layers[key].options.icon.options.className && layers[key].options.icon.options.className == "marker-icon") {
                markers.push(layers[key])
            }
            if (layers[key].feature && layers[key].feature.geometry && layers[key].feature.geometry.type && layers[key].feature.geometry.type == "LineString") {
                lines.push(layers[key])
            }

            if (layers[key].options && layers[key].options.icon && layers[key].options.icon.options && layers[key].options.icon.options.className && layers[key].options.icon.options.className == "marker-icon marker-icon-middle") {
                middleMarkers.push(layers[key])
            }

        }
        if (this.props.geoJsonLayerOptions.removeMiddleMarkers) {
            for (let middleMarker of middleMarkers) {
                middleMarker.remove()
            }
        }

        for (let line of lines) {
            for (let marker of line.pm._markers) {
                if (marker._leaflet_id) {
                    this.markerToLineMapping[marker._leaflet_id] = line._leaflet_id
                }
            }
            let latlngs = line._latlngs;
            let endPoints = [latlngs[0], latlngs[latlngs.length - 1]]
            for (let marker of line.pm._markers) {
                this.markerToLineMapping[marker._leaflet_id] = line._leaflet_id
                for (let latlng of endPoints) {
                    let pt1 = turf.point([latlng.lat, latlng.lng])
                    let pt2 = turf.point([latlng.lat, latlng.lng])
                    let pt3 = turf.point([marker._latlng.lat, marker._latlng.lng])
                    if (turf.booleanEqual(pt1, pt3) || turf.booleanEqual(pt2, pt3)) {
                        this.endMarkers[marker._leaflet_id] = marker
                    }
                }
            }
        }
        // create a map of markers with same lat lon 
        //that map will have marker leaflet id as key and an array of markers having same lat lon
        if (this.props.geoJsonLayerOptions.canDragIntersection) {
            for (let i = 0; i < markers.length; i++) {
                this.mapOfMarkersWithSameCoords[markers[i]._leaflet_id] = []
                for (let j = 0; j < markers.length; j++) {
                    // if()
                    let pt1 = turf.point([markers[i]._latlng.lat, markers[i]._latlng.lng])
                    let pt2 = turf.point([markers[j]._latlng.lat, markers[j]._latlng.lng])
                    if (turf.booleanEqual(pt1, pt2) && i !== j) {
                        this.mapOfMarkersWithSameCoords[markers[i]._leaflet_id].push(markers[j])
                    }
                }
            }
            // now add event listener to all the markers and listen to pm:edit event
            // once any marker -> all the markers in that markers array in map will be moved
            for (let i = 0; i < markers.length; i++) {
                markers[i].on('dragstart', (e) => {
                    this.markerDraggingStarted = true;
                    this.draggingMarkerId = e.sourceTarget._leaflet_id
                })
                markers[i].on('dragend', (e) => {
                    this.markerDraggingStarted = false;
                    this.draggingMarkerId = undefined
                })
                markers[i].on('drag', (e) => {
                    this.lastDragEvent = e;
                    if (this.markerDraggingStarted && this.mapOfMarkersWithSameCoords[this.draggingMarkerId].length > 0) {
                        let markersToBeEdited = this.mapOfMarkersWithSameCoords[this.draggingMarkerId]
                        if (markersToBeEdited.length > 0) {
                            for (let j = 0; j < markersToBeEdited.length; j++) {
                                markersToBeEdited[j].setLatLng(e.latlng)
                            }
                        }
                    }
                })
                if (this.mapOfMarkersWithSameCoords[markers[i]._leaflet_id].length > 0) {
                    this.endMarkers[markers[i]._leaflet_id] = markers[i]
                }
            }
        }

        if (!this.props.geoJsonLayerOptions.canDeleteEndPoints) {
            for (let endMarker of Object.keys(this.endMarkers)) {
                let endMarkerLayer = this.endMarkers[endMarker]
                if (endMarkerLayer._icon && endMarkerLayer._events) {
                    endMarkerLayer._icon.classList.remove("marker-icon")
                    endMarkerLayer._icon.classList.add("non-deletable-marker")
                    endMarkerLayer._events.contextmenu = null;
                }
            }
        }


        if (this.props.geoJsonLayerOptions.canAddPoints) {
            this.props.map.doubleClickZoom.disable();
            this.lead.on('dblclick', (e) => {
                let latlngs = e.sourceTarget._latlngs
                let point1 = e.latlng
                let distances = []
                for (let i = 0; i < latlngs.length - 1; i++) {
                    let pt1 = [latlngs[i].lat, latlngs[i].lng]
                    let pt2 = [latlngs[i + 1].lat, latlngs[i + 1].lng]
                    let line = turf.lineString([pt1, pt2])
                    let pt3 = [point1.lat, point1.lng]
                    distances.push({
                        index: i + 1,
                        distance: turf.pointToLineDistance(pt3, line)
                    })
                }
                distances.sort((a, b) => {
                    return a.distance - b.distance
                })
                let sliceIndex = distances[0].index;
                let featureToBeAdded = e.sourceTarget.feature
                let id = featureToBeAdded.id
                let layers = e.target._layers
                for (let key of Object.keys(layers)) {
                    if (layers[key].feature.id == id) {
                        this.oldMarkers = layers[key].pm._markers
                        let oldLatLngs = layers[key]._latlngs.slice()
                        layers[key]._latlngs.splice(sliceIndex, 0, new L.LatLng(e.latlng.lat, e.latlng.lng))
                        layers[key].redraw()
                        layers[key].pm.enable()
                        break;
                    }
                }
            })
        }

        this.props.map.on('layeradd', (e) => {
            let layers = this.props.map._layers;
            let markers = []
            for (let key of Object.keys(layers)) {
                if (this.props.geoJsonLayerOptions.removeMiddleMarkers && layers[key].options && layers[key].options.icon && layers[key].options.icon.options && layers[key].options.icon.options.className && layers[key].options.icon.options.className == "marker-icon marker-icon-middle") {
                    layers[key].remove()
                    continue;
                }
                // endpoints ka logic 
                if (e.layer && e.layer._latlng && layers[key] && layers[key].pm && layers[key].pm._markers && layers[key].feature && layers[key].feature.geometry && layers[key].feature.geometry.type && layers[key].feature.geometry.type == "LineString") {
                    let latlngs = layers[key]._latlngs;
                    let endPoints = [latlngs[0], latlngs[latlngs.length - 1]]
                    for (let marker of layers[key].pm._markers) {
                        this.markerToLineMapping[marker._leaflet_id] = layers[key]._leaflet_id
                        for (let latlng of endPoints) {
                            let pt1 = turf.point([latlng.lat, latlng.lng])
                            let pt2 = turf.point([latlng.lat, latlng.lng])
                            let pt3 = turf.point([e.layer._latlng.lat, e.layer._latlng.lng])
                            if (turf.booleanEqual(pt1, pt3) || turf.booleanEqual(pt2, pt3)) {
                                this.endMarkers[e.layer._leaflet_id] = e.layer
                            }
                        }
                    }
                }
            }
            if (e.layer && e.layer._latlng) {
                let flag = false;
                for (let oldMarker of this.oldMarkers) {
                    let pt1 = turf.point([oldMarker._latlng.lat, oldMarker._latlng.lng])
                    let pt2 = turf.point([e.layer._latlng.lat, e.layer._latlng.lng])
                    if (turf.booleanEqual(pt1, pt2)) {
                        flag = true
                        for (let key of Object.keys(this.mapOfMarkersWithSameCoords)) {
                            if (key == oldMarker._leaflet_id) {
                                this.mapOfMarkersWithSameCoords[e.layer._leaflet_id] = this.mapOfMarkersWithSameCoords[oldMarker._leaflet_id].slice()
                                delete this.mapOfMarkersWithSameCoords[oldMarker._leaflet_id]
                            } else {
                                let markersToBeReplaced = this.mapOfMarkersWithSameCoords[key]
                                for (let k = 0; k < markersToBeReplaced.length; k++) {
                                    if (markersToBeReplaced[k]._leaflet_id == oldMarker._leaflet_id) {
                                        markersToBeReplaced.splice(k, 1)
                                        markersToBeReplaced.push(e.layer)
                                        break
                                    }
                                }
                            }
                            // intersection logic
                            if (this.mapOfMarkersWithSameCoords[e.layer._leaflet_id] && this.mapOfMarkersWithSameCoords[e.layer._leaflet_id].length > 0) {
                                this.endMarkers[e.layer._leaflet_id] = e.layer
                            }
                        }
                    }
                }

                if (!flag && this.oldMarkers.length > 0) {
                    this.mapOfMarkersWithSameCoords[e.layer._leaflet_id] = []
                }

                if (!this.props.geoJsonLayerOptions.canDeleteEndPoints) {
                    for (let endMarker of Object.keys(this.endMarkers)) {
                        let endMarkerLayer = this.endMarkers[endMarker]
                        if (endMarkerLayer._icon && endMarkerLayer._events) {
                            endMarkerLayer._icon.classList.remove("marker-icon")
                            endMarkerLayer._icon.classList.add("non-deletable-marker")
                            endMarkerLayer._events.contextmenu = null;
                        }
                    }
                }

                if (this.props.geoJsonLayerOptions.canDragIntersection) {
                    e.layer.on('dragstart', (e1) => {
                        this.markerDraggingStarted = true;
                        this.draggingMarkerId = e1.sourceTarget._leaflet_id
                    })

                    e.layer.on('dragend', (e1) => {
                        this.markerDraggingStarted = false;
                        this.draggingMarkerId = undefined
                    })

                    e.layer.on('drag', (e1) => {
                        this.lastDragEvent = e1;
                        if (this.markerDraggingStarted && this.mapOfMarkersWithSameCoords[this.draggingMarkerId] && this.mapOfMarkersWithSameCoords[this.draggingMarkerId].length > 0) {
                            let markersToBeEdited = this.mapOfMarkersWithSameCoords[this.draggingMarkerId]
                            if (markersToBeEdited.length > 0) {
                                for (let j = 0; j < markersToBeEdited.length; j++) {
                                    markersToBeEdited[j].setLatLng(e1.latlng)
                                }
                            }
                        } else if (this.markerDraggingStarted && !this.mapOfMarkersWithSameCoords[this.draggingMarkerId]) {
                            this.mapOfMarkersWithSameCoords[e.layer._leaflet_id] = []
                        }
                    })
                }
            }
        })
    }
}

EditableGeometry.propTypes = {
    feature: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
}

EditableGeometry.defaultProps = {
    geoJsonLayerOptions: {
        style: {
            color: 'darkviolet',
            weight: 7
        },
        canAddPoints: true,
        canDeleteEndPoints: false,
        canDragIntersection: true,
        removeMiddleMarkers: false
    }
}
