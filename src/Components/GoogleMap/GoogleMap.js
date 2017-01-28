import React, { Component } from 'react';
import { connect } from 'react-redux';
import './GoogleMap.css';

const API_KEY = require('../../../config').apiKey;

import * as FamilyActions from '../../Actions/FamilyActions';
import * as SystemActions from '../../Actions/SystemActions';
import * as AppActions from '../../Actions/AppActions';

var self;
const markerIconUrl = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_';

const initialState = {
  showMenu: false,
  menu: {
    x: 0,
    y: 0,
    marker: undefined
  }
};

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    self = this;
    this.state = initialState;
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

    self.map.addListener('rightclick', (e) => {
      console.log('rightclick', e);
      self.hideMenu.call(self);
      self.setState({
        showMenu: true,
        menu: {
          x: e.pixel.x,
          y: e.pixel.y,
          marker: new self.google.maps.Marker({
            position: {lat: e.latLng.lat(), lng: e.latLng.lng()},
            map: self.map,
            title: 'MENU_MARKER',
            icon: markerIconUrl + 'green.png',
            zIndex: 1
          })
        }
      })
    });

    self.map.addListener('bounds_changed', self.hideMenu.bind(self));
    self.map.addListener('click', self.hideMenu.bind(self));

    // Load family
    const user = self.props.user;
    if (user.familyId) {
      self.props.dispatch(FamilyActions.loadFamily(user.familyId, self.addMarkers));
    }
  }

  hideMenu() {
    if (this.state.menu.marker) {
      this.state.menu.marker.setMap(null);
    }
    this.setState(initialState);
  }

  addFavorite(e) {
    e.preventDefault();
    const t = e.target;
    const markerPosition = self.state.menu.marker.getPosition();
    const lat = markerPosition.lat();
    const long = markerPosition.lng();
    const favorite = {
      name: t.name.value,
      lat,
      long,
      radius: 30,
    };
    console.log('user: ', self.props.user);
    this.props.dispatch(FamilyActions.addFavorite(
      this.props.user,
      favorite,
      () => {
        this.hideMenu();
        const family = {...this.props.family}
        family.favorites = this.props.family.favorites.map((f) => {
          if (f.lat === favorite.lat) {
            console.log('found!!!');
            return this.addMarker(f, 'orange');
          } else {
            return f;
          }
        });
        console.log('new family: ', family);
        this.props.dispatch(FamilyActions.updateFamily(family));
      }
    ));
  }

  addMarkers() {
    const user = {...self.props.user};
    const family = {...self.props.family};

    // Add family member markers
    family.members.map((member) => {
      return self.addMarker(member, 'red');
    });

    // Add family favorites markers
    family.favorites.map((favorite) => {
      return self.addMarker(favorite, 'orange');
    });

    // Update state
    self.props.dispatch(FamilyActions.updateFamily(family));
  }

  addMarker(item, color) {
    console.log('Adding marker for', item);
    const onMarkerClick = function(src) {
      const dest = this.getTitle();
      console.log('clicked marker: ' + dest);
      self.props.dispatch(AppActions.setMarked(dest));
      console.log('requestOne(' + src + ', ' + dest + ')');
      self.props.socket.emit('requestOne', {
        src: src,
        dest: dest
      });
    }

    if (item.lat && item.long) {
      const defaultMarkerIcon =  markerIconUrl + color + item.name.charAt(0).toUpperCase() + '.png';
      const marker = new self.google.maps.Marker({
        position: {lat: item.lat, lng: item.long},
        map: self.map,
        title: item._id,
        icon: defaultMarkerIcon,
        zIndex: 1
      });
      marker.addListener('click', onMarkerClick.bind(marker, self.props.user._id));
      item.marker = marker;
      item.defaultMarkerIcon = defaultMarkerIcon;
    }
    console.log('Done adding marker:', item);
    return item;
  }

  componentDidUpdate() {
    const family = this.props.family;
    if (family.favorites) {
      family.favorites.concat(family.members).forEach((item) => {
        if (item.marker) {
          item.marker.setPosition({lat: item.lat, lng: item.long});
          if (item._id === self.props.marked) {
            item.marker.setIcon(markerIconUrl + 'blue' + item.name.charAt(0).toUpperCase() + '.png');
            item.marker.setZIndex(this.google.maps.Marker.MAX_ZINDEX + 1);
          } else {
            item.marker.setIcon(item.defaultMarkerIcon);
            item.marker.setZIndex(1);
          }
        }
      });
    }
  }

  render() {
    const buttonStyle = {
      flexGrow: 1,
      marginTop: '4px'
    }
    const labelStyle = {
      color: '#616161',
      fontSize: '16px',
      marginBottom: '2px',
      textShadow: '1px 1px #fff',
      fontWeight: 'bold'
    }
    return (
      <div className='google-map'>
        <div className='map' ref='map'></div>
        {
          this.state.showMenu &&
          <div id='menu' style={{
              top: this.state.menu.y,
              left: this.state.menu.x
            }}>
            <span style={labelStyle}>Add new favorite</span>
            <form style={{margin: 0}} onSubmit={this.addFavorite.bind(this)}>
              <input type='text' name='name'
                placeholder='Name' autoComplete='off' />
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button type='submit' className='button button--blue'
                  style={buttonStyle}>
                  Add
                </button>
                <button className='button button--red'
                  style={{...buttonStyle, marginLeft: '4px'}}
                  onClick={this.hideMenu.bind(this)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        }
      </div>
    );
  }
}

export default connect((store) => {
  return {
    user: store.user,
    family: store.family,
    marked: store.app.marked,
    google: store.system.google,
    socket: store.system.socket,
  };
})(GoogleMap);

function loadJS(src) {
  let script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  let ref = window.document.getElementsByTagName('script')[0];
  ref.parentNode.insertBefore(script, ref);
}
