import React, { Component } from 'react';
import './GoogleMap.css';
const API_KEY = require('../config').apiKey;

var self;

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
    loadJS('https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&callback=initMap');
  }

  initMap() {
    self.google = this.google;
    console.log('google');
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
      var marker = new self.google.maps.Marker({
        position: {lat: member.lat, lng: member.long},
        map: self.map,
        title: member.name
      });
      member.marker = marker;
      if (self.props.marked === member.name) {
        marker.setLabel('marked');
      }
      marker.addListener('click', onMarkerClick.bind(marker));
    });

    // Add favorites
    this.props.family.favorites.forEach((favorite) => {
      var marker = new self.google.maps.Marker({
        position: {lat: favorite.lat, lng: favorite.long},
        map: self.map,
        title: favorite.name
      });
      favorite.marker = marker;
      if (self.props.marked === favorite.name) {
        marker.setLabel('marked');
      }
      marker.addListener('click', onMarkerClick.bind(marker));
    });

    // Update state
    this.setState({
      family: this.props.family
    });
  }

  render() {
    console.log('GoogleMap render()');
    this.state.family.members.forEach((member) => {
      if (member.marker) {
        if (this.props.marked === member.name) {
          member.marker.setIcon(new this.google.maps.MarkerImage('http://www.googlemapsmarkers.com/v1/ffeb3b/'));
        } else {
          member.marker.setIcon(null);
        }
      }
    });
    return (
      <div className='google-map'>
        <div className='map' ref='map'></div>
      </div>
    );
  }
}

function onMarkerClick() {
  self.props.setMarked(this.getTitle());
  console.log('clicked on marker');
}

function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  ref.parentNode.insertBefore(script, ref);
}
