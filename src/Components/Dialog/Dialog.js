import React, { Component } from 'react';
import './Dialog.css';

import done from '../../img/done_white.svg';
import clear from '../../img/clear_white.svg';

export default class Dialog extends Component {
  render() {
    if (this.props.show) {
      return (
        <div className='dialog'>
          <div className='card'>
            <div className='card__header'>
              <h4>
                { this.props.icon &&
                  <img src={this.props.icon} role='presentation' /> }
                { this.props.title }
              </h4>
            </div>
            <div className='card__body'>
              { this.props.children }
            </div>
            <div className='card__footer'>
              <button className='button button--green'
                onClick={() => {this.props.onConfirm(); this.props.onClose();}}>
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
      )
    } else {
      return null
    }
  }
}
