import React from 'react';

import { Link, Route, Routes } from 'react-router-dom';

import { IStream } from '../../types/stream';
import { IToggleHandler, IToggles } from '../../types/toggles';
import { IDefilerSocketRef } from '../websocket';

type ControlPanelProps = {
  toggles: IToggles;
  toggleHandler: IToggleHandler;
  currentStream: IStream | null;
  streamListCount: number;
  socketRef: IDefilerSocketRef;
  socketSendMessage: (message: string) => void;
};

// style={{display: props.toggles.sidebar ? 'none' : 'block'}}
const ControlPanel = ({
  currentStream,
  streamListCount,
  toggleHandler,
  toggles,
}: ControlPanelProps) => {
  return (
    <div id="control-panel" className="control-panel">
      <div
        className={
          'button toggle chat ' +
          (toggles.sidebar ? 'chat-icon-off' : 'chat-icon-on')
        }
        onClick={() => {
          toggleHandler('sidebar');
        }}
      >
        <div className="icon"></div>
      </div>
      <Link to="/">
        <div className="button defiler">
          <div className="icon"></div>
        </div>
      </Link>
      <Routes>
        <Route path="/stream/:id">
          {currentStream && currentStream.source === 'twitch' && (
            <div
              className={`button toggle twchat ${
                toggles.twchat ? 'active' : null
              }`}
              onClick={() => {
                toggleHandler('twchat');
              }}
            >
              <div className="icon"></div>
            </div>
          )}
        </Route>
      </Routes>
      <div
        className={`button toggle tv ${toggles.streamList ? 'active' : null}`}
        onClick={() => {
          toggleHandler('streamList');
        }}
      >
        <div className="icon"></div>
        <div className="count">{streamListCount}</div>
      </div>
      <div
        className={`button toggle refinery ${
          toggles.refinery ? 'active' : null
        }`}
        onClick={() => {
          toggleHandler('refinery');
        }}
      >
        <div className="icon"></div>
      </div>

      <div
        className={`big-stream-list-switcher ${
          toggles.streamList ? 'displayNone' : null
        }`}
        onClick={() => {
          toggleHandler('streamList');
        }}
      >
        <div className="eye">&nbsp;</div>
        Streams
      </div>
    </div>
  );
};

export default ControlPanel;
