import React, {useState, useEffect} from "react"
import Iframe from 'react-iframe'
import {useParams} from "react-router-dom"
import {Helmet, HelmetProvider} from 'react-helmet-async'

import * as config from "../../config"
import {streamOptions} from "../../config";

export default function Stream(props) {
    let
        {id} = useParams(),
        [stream, setStream] = React.useState({id: -1, state: 'undetermined'})

    const
        getStreamUrl = (source, channel) => {
            switch (source) {
                case 'twitch':
                    return streamOptions.twitch.url.replace(/{channel}/gi, channel);
                case 'afreeca':
                    return streamOptions.afreeca.url.replace(/{channel}/gi, channel);
                case 'goodgame':
                    return streamOptions.goodgame.url.replace(/{channel}/gi, channel);
                default:
                    return false;
            }
        }

    useEffect(() => {
        if (stream.id * 1 === id * 1) return;
        let
            s = props.data.streams.find(stream => stream.id * 1 === id * 1)
        if (typeof s !== typeof undefined) {
            setStream(s);
            props.setCurrentStream(s)
            return;
        }
        if (typeof stream.state !== typeof undefined && stream.state === 'request') return;
        setStream({id: -1, state: 'request'})
        fetch(config.api('stream', id), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: "no-cache",
        })
            .then(response => response.json())
            .then(data => {
                setStream(data.success ? data.stream : {id: id, state: 'not-found'})
                props.setCurrentStream(data.success ? data.stream : false)
            })
            .catch((e) => {
                console.log(e)
                setStream({id: id, state: 'not-found'})
                props.setCurrentStream(false)
            })
    })

    if (stream.state === 'request' || stream.state === 'undetermined') return (<>...</>)

    if (stream.state === 'not-found') return (
        <div className="msg form-control">
            <Helmet><title>{props.title + ': stream not found'}</title></Helmet>
            Stream not found
        </div>
    )

    return (
        <div id="stream-browser" className={`${props.twchat ? 'show-twchat' : 'only-stream'}`}>
            <Helmet><title>{props.title + ': ' + stream.name}</title></Helmet>
            <div className="stream">
                <div className="stream-title">{stream.name}</div>
                <div className="stream-inner load">
                    <Iframe
                        id="current-stream"
                        src={getStreamUrl(stream.source, stream.channel)}
                        width="100%"
                        height="100%"
                        frameBorder={0}
                        scrolling="no"
                        allowFullScreen={true}
                        key={id}
                    />
                </div>
                <div className="stream-info">{stream.info}</div>
            </div>
            <div className="additional-chat">
                {
                    props.twchat &&
                    <Iframe
                        src={streamOptions.twitch.chat.replace(/{channel}/gi, stream.channel)}
                        frameBorder={0}
                        scrolling="no"
                        height="100%"
                        width="100%"
                    />
                }
            </div>
        </div>
    )
}