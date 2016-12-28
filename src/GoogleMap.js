import React, { Component } from 'react';
import './GoogleMap.css';
const API_KEY = require('../config').apiKey;

var self;
let markerIconUrl = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_';

export default class GoogleMap extends Component {
  constructor(props) {
    super(props);
    self = this;
    this.state = {
      family: this.props.family
    };
  }

  componentDidMount() {
    self.mapRef = this.refs.map;
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS('https://maps.googleapis.com/maps/api/js?key=' + API_KEY +
      '&callback=initMap');
  }

  initMap() {
    self.google = this.google;
    const home = {lat: 59.5068518, lng: 17.7573347};
    self.map = new this.google.maps.Map(self.mapRef, {
      zoom: 14,
      center: home
    });
    self.addMarkers();
  }

  addMarkers() {
    // Add family member markers
    this.props.family.members.forEach((member) => {
      let defaultMarkerIcon =  markerIconUrl + 'red' + member.name.charAt(0).toUpperCase() + '.png';
      let marker = new self.google.maps.Marker({
        position: {lat: member.lat, lng: member.long},
        map: self.map,
        title: member._id,
        icon: defaultMarkerIcon
      });
      marker.addListener('click', onMarkerClick.bind(marker));
      member.marker = marker;
      member.defaultMarkerIcon = defaultMarkerIcon;
    });

    // Add family favorites markers
    this.props.family.favorites.forEach((favorite) => {
      let defaultMarkerIcon = markerIconUrl + 'orange' + favorite.name.charAt(0).toUpperCase() + '.png';
      let marker = new self.google.maps.Marker({
        position: {lat: favorite.lat, lng: favorite.long},
        map: self.map,
        title: favorite._id,
        icon: defaultMarkerIcon
      });
      marker.addListener('click', onMarkerClick.bind(marker));
      favorite.marker = marker;
      favorite.defaultMarkerIcon = defaultMarkerIcon;
    });

    // Update state
    this.setState({
      family: this.props.family
    });
  }

  componentDidUpdate() {
    this.state.family.favorites.concat(self.state.family.members)
    .forEach((item) => {
      if (item.marker) {
        item.marker.setPosition({lat: item.lat, lng: item.long});
        item.marker.setIcon(item.defaultMarkerIcon);
        if (item._id === self.props.marked) {
          item.marker.setIcon(markerIconUrl + 'blue' + item.name.charAt(0).toUpperCase() + '.png');
        }
      }
    });
  }

  render() {
    return (
      <div className='google-map'>
        <div className='map' ref='map'></div>
      </div>
    );
  }
}

function onMarkerClick() {
  let id = this.getTitle();
  console.log('clicked marker: ' + id);
  self.props.setMarked(id);
  self.props.requestOne('5804aa86795236fdc199b606', id);
}

function loadJS(src) {
  var ref = window.document.getElementsByTagName('script')[0];
  var script = window.document.createElement('script');
  script.src = src;
  ref.parentNode.insertBefore(script, ref);
}
