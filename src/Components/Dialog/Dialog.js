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
                    <i className={'fa fa-' + this.props.icon} /> }
                  { this.props.title }
                </h4>
                <a onClick={this.props.onClose} className='card__header__link'>
                  <i className='fa fa-times' />
                </a>
              </div>
              <div className='card__body'>
                { this.props.children }
              </div>
              <div className='card__footer'>
                <button className='button button--green'
                  onClick={() => {this.props.onConfirm(); this.props.onClose()}}>
                  <i className='fa fa-check' />
                  <span>Yes</span>
                </button>
                <button className='button button--red'
                  onClick={this.props.onClose}>
                  <i className='fa fa-times' />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    )
  }
}
