import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Chat.css';

import chat from '../../img/chat_white.svg';
import account from '../../img/account_gray.svg';

import { loadChat, sendChatMessage } from '../../Actions/FamilyActions';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    loadChat();
  }

  handleKeyPress(e) {
    if (!e.shiftKey && e.charCode === 13) {  // Enter
      if (ReactDOM.findDOMNode(this.refs.message).value.split(' ').join('').split('\n').join('').length) {
        ReactDOM.findDOMNode(this.refs.button).click();
      } else {
        setTimeout(() => {
          ReactDOM.findDOMNode(this.refs.message).value = '';
        }, 0);
      }
    }
  }

  loadChat() {
    this.props.dispatch(loadChat(this.props.user.familyId));
  }

  send(e) {
    e.preventDefault();
    if (e.target.message.value.split(' ').join('').split('\n').join('').length) {
      this.props.dispatch(sendChatMessage(
        e.target.message.value,
        this.props.user,
        this.props.user.familyId,
        () => ReactDOM.findDOMNode(this.refs.message).value = ''
      ));
    }
    this.loadChat();
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        component='div'
        style={{display: 'flex'}}
        transitionName='chat'
        transitionAppear={true}
        transitionAppearTimeout={200}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}>
        {
          this.props.show &&
          <div id='chat'>
            <div className='chat__messages'>
              <Messages
                messages={this.props.chat}
                user={this.props.user}
                family={this.props.family} />
            </div>
            <div className='chat__interface'>
              <form onSubmit={this.send.bind(this)}>
                <textarea rows='3' name='message' placeholder='Message'
                  autoComplete='off' ref='message' onKeyPress={this.handleKeyPress.bind(this)}/>
                <button ref='button' className='button button--blue'>
                  <i className='fa fa-comment' />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    )
  }
}

export default connect((store) => {
  return {
    user: store.user,
    family: store.family,
    chat: store.family.chat,
  }
})(Chat);

const Messages = (props) => {
  const len = props.messages.length;
  var msgs = [];
  var lastId;

  return (
    <div>
      {
        props.messages.map((msg, i) => {
          if (len === i+1) {
            if (i === 0 || msg.userId === lastId) {
              msgs.push(msg);
              return ( <MessageRow { ...props } key={i} messages={[...msgs]} /> )
            } else {
              return (
                <div key={-i}>
                  <MessageRow { ...props } key={i} messages={[...msgs]} />
                  <MessageRow { ...props } key={i+1} messages={[msg]}/>
                </div>
              )
            }
          } else {
            if (i !== 0 && msg.userId !== lastId) {
              const send = [...msgs];
              msgs = [];
              lastId = msg.userId;
              msgs.push(msg);
              return ( <MessageRow { ...props } key={i} messages={[...send]} /> )
            } else {
              lastId = msg.userId;
              msgs.push(msg);
              return null;
            }
          }
        })
      }
    </div>
  )
}

const MessageRow = ({ messages, user, family }) => {
  const { userId } = messages[0];
  var sender;
  for (let member of family.members) {
    if (member._id === userId) {
      sender = member;
      break;
    }
  }

  if (sender) {
    return (
      <div className={'chat__row' + (userId === user._id ? ' self' : '')}>
        <div className='chat__row__title'>{ sender.firstName }</div>
        <div className={'chat__message' + (userId === user._id ? ' self' : '')}>
          <div className='chat__image'>
            {
              sender.imageUrl || sender.googleImageUrl ?
                <img className='round' role='presentation'
                  src={sender.imageUrl || sender.googleImageUrl} />
                : <i className='fa fa-user gray' />
            }
          </div>
          <div className='chat__bubble'>
            {
              messages.map((msg) => {
                return (
                  <span key={msg._id}>{ msg.text }</span>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
