import React, { Component } from 'react';
import './Drawer.css';

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('Drawer render()');
    let props = this.props;
    return (
      <div className='drawer'>
        <div className='family'>
          <div className='list'>
            <div className='list__header'>
              <h5>{props.family.name}</h5>
            </div>
            {
              props.family.members &&
              props.family.members.map(function(member, i) {
                return (
                  <a key={i}
                  className={'list__item' + (props.marked === member.name ? ' active' : '')}
                  href={'#' + member.name}
                  onClick={() => props.setMarked(member.name)}>
                    {member.name}
                  </a>
                );
              })
            }
          </div>
        </div>
        <div className='details'>
          {
            this.props.family.members &&
            props.family.members.map(function(member, i) {
              if (member.name === props.marked) {
                return (
                  <div key={i}>
                    <h5>{member.name}</h5>
                    <span>{member.email || member.gmail}</span>
                  </div>
                );
              }
            })
          }
        </div>
      </div>
    );
  }
}
