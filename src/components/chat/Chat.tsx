//TODO: разобраться с многократной отрисовкой
//TODO: баг: первое сообщение со скроллом при первой загрузке сайта вызывает сбой стилей
//TODO: баг: после добавления сообщения класс to-user не переносится!
import { useEffect, useRef, useState } from 'react';

import { Link } from 'react-router-dom';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { useFocus, useForceUpdate } from '../../hooks';
import { IUser } from '../../types/user';
import { IDefilerSocketRef, IMessagePayload } from '../websocket';
import Message from './Message';

let scrollbarClassFix = true;

type IChatProps = {
  ws: IDefilerSocketRef;
  auth: string | null;
  messages: IMessagePayload;
  refreshData: (target: string) => void; // TODO: define all target union types
  user: IUser;
};
const Chat = (props: IChatProps) => {
  const [inputRef, setInputFocus] = useFocus();
  const forceUpdate = useForceUpdate();
  const [value, setValue] = useState('');
  const [ping, setPing] = useState(props.ws.current?.getPing());
  const [lifetime, setLifetime] = useState(0);
  const lm = useRef<string[]>([]);
  const chosen = useRef(-1);
  const temp = useRef('');
  const [hideList, setHideList] = useState<number[]>([]);

  const chatMessage = () => {
    if (value === '') return;
    if (
      props.ws.current?.send({
        cmd: 'tavern.say',
        auth: props.auth || undefined,
        text: value,
      })
    ) {
      lm.current.push(value);
      lm.current.length > 5 && lm.current.splice(0, lm.current.length - 5);
      chosen.current = -1;
      setValue('');
    }
  };
  const handleOnChange = (e) => {
    setValue(e.target.value);
  };
  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        if (lm.current.length === 0) return false;
        if (chosen.current < lm.current.length - 1) {
          if (chosen.current !== -1) {
            chosen.current++;
            setValue(lm.current[chosen.current]);
          }
        } else {
          setValue(temp.current);
          chosen.current = -1;
        }
        break;
      case 'ArrowUp':
        if (lm.current.length === 0) return false;
        if (chosen.current > 0) {
          chosen.current--;
          setValue(lm.current[chosen.current]);
        }
        if (chosen.current === -1) {
          temp.current = value;
          chosen.current = lm.current.length - 1;
          setValue(lm.current[chosen.current]);
        }
        break;
      case 'Enter':
        chatMessage();
        break;
    }
  };
  const insertName = (e) => {
    setValue(
      value + (e.target.text[0] !== '@' ? '@' : '') + e.target.text + ', ',
    );
    setInputFocus();
  };
  const insertPic = (e) => {
    setValue(value + '' + e.target.getAttribute('alt') + '');
    setInputFocus();
  };
  const getPingColor = (v) => {
    if (v === '?') return 'ping-blue';
    if (v === 'dead') return 'ping-red';
    if (!Number.isInteger(v)) return 'ping-violet';
    v = v * 1;
    if (v < 100) return 'ping-green';
    if (v >= 100 && v < 200) return 'ping-yellow';
    if (v >= 200 && v < 500) return 'ping-orange';
    if (v >= 500 && v < 1000) return 'ping-salmon';
    if (v >= 1000) return 'ping-red';
  };
  const getLifetime = (p) => {
    const x = Math.floor(p / (60 * 1000)),
      days = Math.floor(x / (60 * 24)),
      hours = Math.floor(x / 60) - days * 24,
      mins = x % 60,
      lifetime = [
        days > 0 ? days + 'd' : null,
        hours > 0 ? hours + 'h' : null,
        mins > 0 ? mins + 'm' : null,
      ]
        .join(' ')
        .trim();
    if (x < 0) return 'error';
    return lifetime === '' ? '-' : lifetime;
  };
  const addToHideList = (id: number) => {
    setHideList((prev) => [...prev, id]);
    setHideList(hideList);
    forceUpdate();
  };
  const updateScrollClass = () => {
    const messages = document.getElementsByClassName('chat-message');
    for (let i = 0; i < messages.length; i++) {
      const msgText =
        messages[i].getElementsByClassName('chat-message-text')[0];
      if (msgText.scrollHeight > msgText.clientHeight) {
        messages[i].classList.add('has-scrollbar');
      } else if (messages[i].classList.contains('has-scrollbar')) {
        messages[i].classList.remove('has-scrollbar');
      }
    }
  };
  const messages = props.messages ? (
    <Message
      user={props.user}
      key={0}
      message={{
        name: 'StarCraft:Broodwar',
        author: 0,
        text: ':happy:',
        time: '1998-12-18 00:00:00',
      }}
      insertName={insertName}
      insertPic={insertPic}
      hideList={hideList}
      addToHideList={addToHideList}
    />
  ) : (
    props.messages.map((message, index) => (
      <Message
        user={props.user}
        //key={index}
        key={message.id}
        message={message}
        insertName={insertName}
        insertPic={insertPic}
        hideList={hideList}
        addToHideList={addToHideList}
      />
    ))
  );

  useEffect(() => {
    if (!props.ws.current) return;
    const ws = props.ws.current;
    ws.addListener('Pong', (ping, lifetime) => {
      setPing(ping);
      setLifetime(lifetime);
    });
    ws.addListener('Message', (message) => {
      if (message === 'tavern.msg') {
        props.refreshData('tavern');
        return;
      }
      try {
        const msg = JSON.parse(message);
        if (msg.from === 'tavern' && typeof msg.message !== typeof undefined) {
          if (value === '')
            setValue(
              lm.current.length > 0 ? lm.current[lm.current.length - 1] : '',
            );
          setPing(msg.message);
        }
      } catch (e) {}
    });
    ws.addListener('Close', () => {
      setPing('dead');
      setLifetime(0);
    });
    ws.addListener('Open', () => {
      setPing('?');
      setLifetime(0);
    });
  }, []);

  useEffect(() => {
    if (scrollbarClassFix) {
      setTimeout(updateScrollClass, 100); // fix for the first page loading... (?)
      scrollbarClassFix = false;
    } else updateScrollClass();
  }, [props.messages]);

  return (
    <div className="chat">
      <div className="chat-header">
        <div className="close" onClick={props.closeToggle}></div>
        <div
          className="popup"
          onClick={() => {
            console.warn('TODO: to implement `popup` `onClick` event');
          }}
        ></div>
        <div
          className="menus"
          onClick={() => {
            console.warn('TODO: to implement `menus` `onClick` event');
          }}
        ></div>
        <div className="switch" onClick={props.switchToggle}></div>
        <div className="name">
          <Link to="/profile">{props.user.name}</Link>
        </div>
      </div>
      <PerfectScrollbar
        className="chat-messages"
        options={{ wheelPropagation: false }}
      >
        {messages}
      </PerfectScrollbar>
      <div className="chat-footer">
        <input
          ref={inputRef}
          type="text"
          className=""
          autoComplete="off"
          value={value}
          onChange={handleOnChange}
          onKeyDown={handleKeyPress}
        />
        <div className="status info_text" onClick={chatMessage}>
          {Number.isInteger(ping) ? (
            <>
              <span className={`uptime`}>uptime: {getLifetime(lifetime)}</span>
              <span className={`status-divider`}> | </span>
              <span className={`ping ${getPingColor(ping)}`}>
                ping: {ping}
                {ping !== 'dead' && ping !== '?' ? 'ms' : null}
              </span>
            </>
          ) : (
            <span className={`${getPingColor(ping)}`}>{ping}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
