import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import Iframe from 'react-iframe';

import { StreamSource, api, streamOptions } from '../../config';
import { IStream } from '../../types/stream';

type State = 'undetermined' | 'not-found' | 'request' | 'ok';

type StreamProps = {
  data: { streams: IStream[] };
  setCurrentStream: (s: IStream | null) => void;
  title: string;
  twchat: boolean;
};

export default function Stream(props: StreamProps) {
  const { id: idParam } = useParams();
  const id = !idParam ? 0 : parseInt(idParam);

  const [state, setState] = useState<State>('undetermined');
  const [stream, setStream] = React.useState<IStream | null>(null);

  const getStreamUrl = (source: StreamSource, channel: string) => {
    return streamOptions[source].url.replace(/{channel}/gi, channel);
  };

  useEffect(() => {
    if (stream !== null && stream.id === id) return;
    const s =
      stream && props.data.streams.find((stream: IStream) => stream.id === id);
    if (s) {
      setStream(s);
      props.setCurrentStream(s);
      return;
    }
    if (state === 'request') return;
    setState('request');
    fetch(api('stream', id), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          setStream(null);
          props.setCurrentStream(null);
        }
        setStream(data.stream);
        props.setCurrentStream(data.stream);
        setState('ok');
      })
      .catch((e) => {
        console.log(e);
        setState('not-found');
        props.setCurrentStream(null);
      });
  });

  if (state === 'request' || state === 'undetermined') return <>...</>;

  if (state === 'not-found' || stream === null)
    return (
      <div className="msg form-control">
        <Helmet>
          <title>{props.title + ': stream not found'}</title>
        </Helmet>
        Stream not found
      </div>
    );

  return (
    <div
      id="stream-browser"
      className={`${props.twchat ? 'show-twchat' : 'only-stream'}`}
    >
      <Helmet>
        <title>{props.title + ': ' + stream.name}</title>
      </Helmet>
      <div className="stream">
        <div className="stream-title">{stream.name}</div>
        <div className="stream-inner load">
          <Iframe
            id="current-stream"
            /*src={getStreamUrl(stream.source, stream.channel)}*/ // TODO: make sure url is the replacement
            url={getStreamUrl(stream.source, stream.channel)}
            width="100%"
            height="100%"
            frameBorder={0}
            scrolling="no"
            allowFullScreen={true}
            key={idParam}
          />
        </div>
        <div className="stream-info">{stream.info}</div>
      </div>
      <div className="additional-chat">
        {props.twchat && (
          <Iframe
            /*src={streamOptions.twitch.chat.replace(/{channel}/gi, stream.channel)}*/ // TODO: make sure url is the replacement
            url={streamOptions.twitch.chat.replace(
              /{channel}/gi,
              stream.channel,
            )}
            frameBorder={0}
            scrolling="no"
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}
