import React, { Component } from 'react';
import { connect } from 'react-redux';
import './GoogleMap.css';
const API_KEY = require('../../../config').apiKey;

import * as FamilyActions from '../../Actions/FamilyActions';
import * as SystemActions from '../../Actions/SystemActions';
import * as AppActions from '../../Actions/AppActions';

var self;
const markerIconUrl = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_';

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    self = this;
  }

  componentDidMount() {
    self.mapRef = this.refs.map;
    if (this.props.google) {
      self.google = this.props.google;
      this.initMap();
      return;
    }
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS('https://maps.googleapis.com/maps/api/js?key=' + API_KEY +
      '&callback=initMap');
  }

  initMap() {
    if (!self.google) {
      self.google = this.google;
      self.props.dispatch(SystemActions.setGoogle(this.google));
    }
    const home = {lat: 59.5068518, lng: 17.7573347};
    self.map = new self.google.maps.Map(self.mapRef, {
      zoom: 14,
      center: home
    });

    self.map.addListener('rightclick', () => {
      console.log('rightclick');
    });

    // Load family
    const user = self.props.user;
    if (user.familyId) {
      self.props.dispatch(FamilyActions.loadFamily(user.familyId, self.addMarkers));
    }
  }

  addMarkers() {
    const user = self.props.user;
    const family = self.props.family;

    // Add family member markers
    family.members.forEach((member) => {
      if (member.lat && member.long) {
        let defaultMarkerIcon =  markerIconUrl + 'red' + member.name.charAt(0).toUpperCase() + '.png';
        let marker = new self.google.maps.Marker({
          position: {lat: member.lat, lng: member.long},
          map: self.map,
          title: member._id,
          icon: defaultMarkerIcon
        });
        marker.addListener('click', onMarkerClick.bind(marker, user._id));
        member.marker = marker;
        member.defaultMarkerIcon = defaultMarkerIcon;
      }
    });

    // Add family favorites markers
    family.favorites.forEach((favorite) => {
      if (favorite.lat && favorite.long) {
        let defaultMarkerIcon = markerIconUrl + 'orange' + favorite.name.charAt(0).toUpperCase() + '.png';
        let marker = new self.google.maps.Marker({
          position: {lat: favorite.lat, lng: favorite.long},
          map: self.map,
          title: favorite._id,
          icon: defaultMarkerIcon
        });
        marker.addListener('click', onMarkerClick.bind(marker, user._id));
        favorite.marker = marker;
        favorite.defaultMarkerIcon = defaultMarkerIcon;
      }
    });

    // Update state
    FamilyActions.updateFamily(family);
  }

  componentDidUpdate() {
    const family = this.props.family;
    family.favorites.concat(family.members).forEach((item) => {
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

export default connect((store) => {
  return {
    user: store.user.user,
    family: store.family.family,
    marked: store.app.marked,
    google: store.system.google,
    socket: store.system.socket,
  };
})(GoogleMap);

function onMarkerClick(src) {
  const dest = this.getTitle();
  console.log('clicked marker: ' + dest);
  self.props.dispatch(AppActions.setMarked(dest));
  console.log('requestOne(' + src + ', ' + dest + ')');
  self.props.socket.emit('requestOne', {
    src: src,
    dest: dest
  });
}

function loadJS(src) {
  let script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  let ref = window.document.getElementsByTagName('script')[0];
  ref.parentNode.insertBefore(script, ref);
}
