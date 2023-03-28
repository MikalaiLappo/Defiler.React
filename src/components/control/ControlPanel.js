import React from "react"
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom"


// style={{display: props.toggles.sidebar ? 'none' : 'block'}}
export default function ControlPanel(props) {

    return (
        <div id="control-panel" className="control-panel">
            <div
                className={"button toggle chat " + (props.toggles.sidebar ? 'chat-icon-off' : 'chat-icon-on')}
                onClick={() => {
                    props.toggleHandler('sidebar')
                }}
            >
                <div className="icon"></div>
            </div>
            <Link to="/">
                <div className="button defiler">
                    <div className="icon"></div>
                </div>
            </Link>
            <Switch>
                <Route path="/stream/:id">
                    {
                        props.currentStream.source === 'twitch'
                        &&
                        <div
                            className={`button toggle twchat ${props.toggles.twchat ? 'active' : null}`}
                            onClick={() => {
                                props.toggleHandler('twchat')
                            }}
                        >
                            <div className="icon"></div>
                        </div>
                    }
                </Route>
            </Switch>
            <div
                className={`button toggle tv ${props.toggles.streamList ? 'active' : null}`}
                onClick={() => {
                    props.toggleHandler('streamList')
                }}
            >
                <div className="icon"></div>
                <div className="count">{props.streamListCount}</div>
            </div>
            <div
                className={`button toggle refinery ${props.toggles.refinery ? 'active' : null}`}
                onClick={() => {
                    props.toggleHandler('refinery')
                }}
            >
                <div className="icon"></div>
            </div>

            <div
                className={`big-stream-list-switcher ${props.toggles.streamList ? 'displayNone' : null}`}
                onClick={() => {
                    props.toggleHandler('streamList')
                }}
            >
                <div className="eye">&nbsp;</div>
                Streams
            </div>
        </div>
    )
}