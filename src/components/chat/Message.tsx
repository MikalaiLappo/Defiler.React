import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { IMessageProps } from '../../types/chat.js';
import TextBuilder from './TextBuilder.js';

const Message = (props: IMessageProps) => {
  const getTime = (time) => {
      const t = time.split(/[- :]/);
      return t[3] + ':' + t[4];
    },
    p = props.message.text.indexOf(props.user.name),
    messageToUser =
      p >= 0 &&
      (p + props.user.name.length >= props.message.text.length ||
        '., :;()=+'.includes(props.message.text[p + props.user.name.length])),
    [messageClasses, setMessageClasses] = React.useState(
      ['chat-message']
        .concat(
          messageToUser && props.user.name !== props.message.name
            ? 'to-user'
            : '',
        )
        .concat(
          props.hideList.includes(props.message.author) ? 'displayNone' : '',
        )
        .join(' ')
        .trim(),
    );

  return (
    <div className={messageClasses}>
      <div className="chat-message-header">
        <div
          className={`chat-nick ${
            props.user.id == props.message.author ||
            (props.message.author <= 0 && props.user.id <= 0)
              ? 'my-nick'
              : ''
          }`}
        >
          <a onClick={props.insertName}>{props.message.name}</a>
        </div>
        <div className="chat-nick-id">
          <Link to={'/user/' + props.message.author}>
            {props.message.author}
          </Link>
        </div>
        <div className="chat-nick-hide">
          <a
            onClick={() => {
              props.addToHideList(props.message.author);
            }}
          >
            hide
          </a>
        </div>
        <div className="chat-time">{getTime(props.message.time)}</div>
      </div>
      <div className="chat-message-text">
        <TextBuilder
          text={props.message.text}
          insertName={props.insertName}
          insertPic={props.insertPic}
        />
      </div>
    </div>
  );
};

export default Message;
