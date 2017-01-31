import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Modal.css';

export default class Modal extends Component {
  render() {
    return (
      <ReactCSSTransitionGroup
        component='div'
        className='modal'
        transitionName='modal'
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}>
        { this.props.children }
      </ReactCSSTransitionGroup>
    );
  }
}
