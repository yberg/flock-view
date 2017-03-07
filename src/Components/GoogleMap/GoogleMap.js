import React, { Component } from 'react';
import { connect } from 'react-redux';
import './GoogleMap.css';

const API_KEY = require('../../../config').apiKey;

import * as FamilyActions from '../../Actions/FamilyActions';
import * as SystemActions from '../../Actions/SystemActions';
import * as AppActions from '../../Actions/AppActions';

var self;
const markerIconUrl = 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_';
const MarkerType = {
  MEMBER: 'MEMBER',
  FAVORITE: 'FAVORITE'
};

const circleStyle = {
  fillColor: '#4caf50',
  strokeColor: '#4caf50',
  strokeOpacity: 0.5,
  strokeWeight: 2
};

const initialState = {
  showMenu: false,
  menu: {
    x: 0,
    y: 0,
    marginLeft: 0,
    marginTop: 0,
    radius: 50
  },
};

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    self = this;
    this.state = initialState;
  }

  handleChange(e) {
    const radius = e.target.value;
    const { circle } = this.state.menu;
    circle.setRadius(Number(radius));
    this.setState({
      menu: {
        ...this.state.menu,
        circle,
        radius
      },
    });
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
    const home = { lat: 59.5068518, lng: 17.7573347 };
    self.map = new self.google.maps.Map(self.mapRef, {
      zoom: 14,
      center: home
    });
    self.props.dispatch(SystemActions.setMap(self.map));

    const marker = new self.google.maps.Marker({
      map: self.map,
      title: 'MENU_MARKER',
      icon: markerIconUrl + 'green.png',
      zIndex: 1
    });

    const circle = new self.google.maps.Circle({
      map: self.map,
      radius: Number(self.state.menu.radius),
      visible: false,
      ...circleStyle
    });
    circle.bindTo('center', marker, 'position');

    self.setState({
      menu: {
        ...self.state.menu,
        marker,
        circle,
      }
    });

    self.map.addListener('rightclick', (e) => {
      self.hideMenu.call(self);

      const { x, y } = e.pixel;
      const { clientWidth, clientHeight } = document.getElementById('google-map');
      const { marker, circle } = self.state.menu;
      marker.setVisible(true);
      marker.setPosition({lat: e.latLng.lat(), lng: e.latLng.lng()});
      circle.setVisible(true);
      self.setState({
        showMenu: true,
        menu: {
          ...self.state.menu,
          x: x,
          y: y,
          marginLeft: x > clientWidth - 250 ? '-250px' : '0',
          marginTop: y > clientHeight - 150 ? '-150px' : '0',
        }
      });
    });

    self.map.addListener('bounds_changed', self.hideMenu.bind(self));
    self.map.addListener('click', self.hideMenu.bind(self));

    // Load family
    const { user } = self.props;
    if (user.familyId) {
      self.props.dispatch(FamilyActions.loadFamily(user.familyId, self.addMarkers.bind(self)));
    }
  }

  hideMenu() {
    if (this.state.menu.marker) {
      this.state.menu.marker.setVisible(false);
    }
    if (this.state.menu.circle) {
      this.state.menu.circle.setVisible(false);
    }
    this.setState({ showMenu: false });
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
    this.props.dispatch(FamilyActions.addFavorite(
      this.props.user,
      favorite,
      () => {
        this.hideMenu();
        const family = {...this.props.family}
        family.favorites = this.props.family.favorites.map((f) => {
          if (f.lat === favorite.lat) {
            return this.addMarker(f, MarkerType.FAVORITE);
          } else {
            return f;
          }
        });
        this.props.dispatch(FamilyActions.updateFamily(family));
      }
    ));
  }

  addMarkers() {
    const family = {...this.props.family};

    let bounds = new this.google.maps.LatLngBounds();

    // Add family member markers
    family.members.forEach((member) => {
      this.addMarker(member, MarkerType.MEMBER);
      bounds.extend(member.marker.getPosition());
    });

    this.map.fitBounds(bounds);

    // Add family favorites markers
    family.favorites.forEach((favorite) => {
      this.addMarker(favorite, MarkerType.FAVORITE);
    });

    // Update state
    this.props.dispatch(FamilyActions.updateFamily(family));
  }

  addMarker(item, markerType) {
    const color = markerType === MarkerType.MEMBER ? 'red' : 'orange';
    if (item.lat && item.long) {
      const defaultMarkerIcon =  markerIconUrl + color + item.name.charAt(0).toUpperCase() + '.png';
      const marker = new this.google.maps.Marker({
        position: {lat: item.lat, lng: item.long},
        map: this.map,
        title: item.name,
        icon: defaultMarkerIcon,
        //icon: item.googleImageUrl || defaultMarkerIcon,
        zIndex: 1,
        user: item
      });
      marker.addListener('click', this.onMarkerClick.bind(item, this.props.user._id, markerType));
      item.marker = marker;
      item.defaultMarkerIcon = defaultMarkerIcon;

      // Add circle around favorite markers
      if (markerType === MarkerType.FAVORITE) {
        const circle = new self.google.maps.Circle({
          map: self.map,
          radius: Number(self.state.menu.radius),
          visible: false,
          ...circleStyle
        });
        circle.bindTo('center', item.marker, 'position');
        item.circle = circle;
      }
    }
    return item;
  }

  onMarkerClick(userId, markerType) {
    const markedUser = this.marker.user;
    self.props.dispatch(AppActions.setMarked(markedUser, markerType));
  }

  requestOne(src, dest) {
    console.log('requestOne(' + src + ', ' + dest + ')');
    this.props.socket.emit('requestOne', {
      src,
      dest
    });
  }

  componentDidUpdate() {
    const { marked, markerType } = this.props;
    if (marked !== this.state.marked) {
      const { family } = this.props;
      if (family.favorites) {
        // Reset non-marked markers
        family.favorites.concat(family.members).forEach((item) => {
          if (item.marker) {
            item.marker.setPosition({lat: item.lat, lng: item.long});
            item.marker.setIcon(item.defaultMarkerIcon);
            item.marker.setZIndex(1);
          }
          if (item.circle) {
            item.circle.setVisible(false);
          }
        });
      }

      // Set marked
      if (marked._id) {
        if (!this.map.getBounds().contains(marked.marker.getPosition())) {
          this.map.panTo({ lat: marked.lat, lng: marked.long });
        }
        marked.marker.setIcon(markerIconUrl + 'blue' + marked.name.charAt(0).toUpperCase() + '.png');
        marked.marker.setZIndex(this.google.maps.Marker.MAX_ZINDEX + 1);
        if (markerType === MarkerType.MEMBER) {
          this.requestOne(this.props.user._id, marked._id);
        } else if (markerType === MarkerType.FAVORITE) {
          marked.circle.setVisible(true);
        }
      }
      this.setState({ marked: this.props.marked });
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
      fontWeight: 'bold',
      zIndex: 10
    }
    return (
      <div id='google-map'>
        <div className='map' ref='map'></div>
        {
          this.state.showMenu &&
          <div id='menu' style={{
              top: this.state.menu.y,
              left: this.state.menu.x,
              marginTop: this.state.menu.marginTop,
              marginLeft: this.state.menu.marginLeft
            }}>
            <span style={labelStyle}>Add new favorite</span>
            <form style={{margin: 0}} onSubmit={this.addFavorite.bind(this)}>
              <div className='input-container'>
                <input type='text' name='name'
                  placeholder='Name' autoComplete='off' />
                <input type='number' name='radius'
                  placeholder='Radius' autoComplete='off' step='5' min='0'
                  value={this.state.menu.radius} onChange={this.handleChange.bind(this)} />
              </div>
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
    markerType: store.app.markerType,
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
