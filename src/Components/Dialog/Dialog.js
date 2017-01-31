import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Dialog.css';

import done from '../../img/done_white.svg';
import clear from '../../img/clear_white.svg';

export default class Dialog extends Component {
  render() {
    return (
      <ReactCSSTransitionGroup
        component='div'
        className='dialog'
        transitionName='dialog'
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}>
        {
          this.props.show &&
          <div className='dialog'>
            <div className='card'>
              <div className='card__header'>
                <h4>
                  { this.props.icon &&
                    <img src={this.props.icon} role='presentation' /> }
                  { this.props.title }
                  <a onClick={this.props.onClose} className='push-right'>&times;</a>
                </h4>
              </div>
              <div className='card__body'>
                { this.props.children }
              </div>
              <div className='card__footer'>
                <button className='button button--green'
                  onClick={() => {this.props.onConfirm(); this.props.onClose()}}>
                  <img src={done} role='presentation' />
                  Yes
                </button>
                <button className='button button--red'
                  onClick={this.props.onClose}>
                  <img src={clear} role='presentation' />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    )
  }
}
