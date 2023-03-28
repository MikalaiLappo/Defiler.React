// TODO: несколько языков
// TODO: вынести interval из streamList
// TODO: вынести forceUpdate из Chat
// TODO: перенести скроллбар внутрь streamList
// TODO: Очистка хайдлиста при разлогине и в целом проверить чат после разлогина
// TODO: Если быстро переключать стримы, то они путаются
// TODO: чат должен оказываться ниже стрима при скукоживании / дизайн
// TODO: defiler должен открывать классную квадратную менюшку
// TODO: при смене почты вывести уведомление о том, что почту следует подвердить, если есть такая опция
// TODO: иногда резервный чат чернеет (?)
// TODO: продумать дизайн мобильной версии
// TODO: проблема со скроллом чата внутри скролла с сообщением
// TODO: МВ съезжает race picker, ширина основного меню чуть больше чем нужно

/*
testiki
<button onClick={() => this.DWSS.send('ping')}>ping</button>
<button onClick={() => this.DWSS.send('zzz-message')}>msg</button>
<Link to="/bunker"><button type="button">lisy</button></Link>
*/

import React, {Component} from "react"
import {Helmet, HelmetProvider} from 'react-helmet-async'
import Cookies from 'universal-cookie'
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom"
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

import '../styles/index.scss'
import * as config from "./../config"
import * as test from "./../data"
import DefilerWebSocketServer from './websocket'

// Defiler Components
import ControlPanel from './control/ControlPanel'
import Stream from './stream/Stream'
import StreamList from './stream/StreamList'
import Content from './content/Content'
import Login from './profile/Login'
import Logout from './profile/Logout'
import Profile from './profile/Profile'
import Register from './profile/Register'
import Chat from './chat/Chat'
import Bunker from "./chat/Bunker";
import SupplyText from "./elements/SupplyText";
import {streamOptions} from "../config";


class App extends Component {

    constructor(props) {
        super(props)

        this.state = {
            auth: false,
            user: false,
            loading: true,
            toggles: {
                sidebar: window.innerWidth >= 800,
                twchat: false,
                refinery: false,
                streamList: window.innerWidth >= 1400,
            },
            useBunkerChat: true,
            currentStream: false,
            data: {title: 'Defi'},
        }

        this.toggle = this.toggle.bind(this)
        this.refreshAuth = this.refreshAuth.bind(this)
        this.setCurrentStream = this.setCurrentStream.bind(this)
        this.bunkerChat = this.bunkerChat.bind(this)

        // Defiler WebSocket Server
        this.DWSS = new DefilerWebSocketServer(config.wsServerOptions)
    }

    refreshAuth = () => {
        const
            cookies = new Cookies(),
            authKey = cookies.get('DefilerAuthKey')
        this.setState({
            auth: (typeof authKey !== typeof undefined) ? authKey : false
        })
        fetch(config.api('hello') + '/' + authKey, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify({auth: authKey}), //POST
            cache: "no-cache",
        })
            .then(response => response.json())
            .then(data => {
                this.setState({user: {'id': data.id, 'name': data.name}})
                if (data.id <= 0) {
                    cookies.remove('DefilerAuthKey')
                    this.setState({
                        auth: false
                    })
                }
            })
            .catch((e) => {
                console.log(e)
            });
    }

    refreshData = (dataField = 'carrier', command = false) => {
        //console.log(dataField)
        if (command === false) command = dataField
        fetch(config.api(command), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: "no-cache",
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (dataField === 'carrier')
                        this.setState({
                            loading: false,
                            data: data
                        })
                    else
                        this.setState(prevState => {
                            let T = prevState.data
                            T[dataField] = data[dataField]
                            return {data: T}
                        })
                }
                else {
                    // --- Something wrong with api
                }
            })
            .catch((e) => {
                console.log(e)
                // --- Api is dead
            });
    }

    setCurrentStream = (stream) => {
        this.setState((prevState) => {
            return {
                currentStream: stream,
                toggles: {
                    ...prevState.toggles,
                    twchat: stream.source !== 'twitch' ? false : prevState.toggles.twchat
                }
            }
        })
    }

    toggle(target) {
        this.setState(prevState => {
            let T = prevState.toggles
            T[target] = !prevState.toggles[target]
            return {toggles: T}
        })
    }

    bunkerChat() {
        this.setState({useBunkerChat: true})
    }

    componentDidMount() {
        if (window.innerWidth < 800) this.setState({sidebar: false})
        window.addEventListener('resize', this.updateDimensions)
        this.refreshAuth()
        this.refreshData()

        window.addEventListener('message', event => {
            if (!event.origin.startsWith(config.bunkerOrigin)) return
            if (event.data === 'supply-chat-close') this.toggle('sidebar')
            if (event.data === 'supply-chat-switch') this.setState({useBunkerChat: false})
        }, false);
    }

    componentWillUnmount() {
        //cleanup before component disappear
        window.removeEventListener('resize', this.updateDimensions)
    }

    updateDimensions() {
        //this.setState({ width: window.innerWidth, height: window.innerHeight })
        //style changes?
    }

    render() {

        if (this.state.loading) return (<></>)

        if (document.getElementById("loading-cover"))
            document.getElementById("loading-cover").outerHTML = ''

        return (
            <>
                <div id="page-container">
                    <Router>
                        <nav id="sidebar" className={!this.state.toggles.sidebar ? 'hidden' : null}>
                            {
                                this.state.useBunkerChat
                                    ? <Bunker auth={this.state.auth}/>
                                    :
                                    <Chat
                                        auth={this.state.auth}
                                        user={this.state.user}
                                        messages={this.state.data.tavern}
                                        refreshData={this.refreshData}
                                        ws={this.DWSS}
                                        closeToggle={() => {
                                            this.toggle('sidebar')
                                        }}
                                        switchToggle={this.bunkerChat}
                                    />
                            }
                            {/*
                                    <>
                                        <div className="sidebar-header">
                                            <div className="close" onClick={() => {
                                                this.toggle('sidebar')
                                            }}>&nbsp;</div>
                                            <img id="logo" className="logo" src="/images/logo.svg"/>
                                            <div className="name"><Link to="/profile">{this.state.user.name}</Link></div>
                                        </div>
                                        < div className="sidebar-wrapper">
                                            <div className="sidebar-content">
                                                <Chat
                                                    auth={this.state.auth}
                                                    user={this.state.user}
                                                    messages={this.state.data.tavern}
                                                    refreshData={this.refreshData}
                                                    ws={this.DWSS}
                                                />
                                            </div>
                                            <div className="sidebar-footer">
                                                footer
                                            </div>
                                        </div>
                                    </>
                                    */}

                        </nav>
                        <nav id="stream-list" className={!this.state.toggles.streamList ? 'hidden' : null}
                             key={this.state.toggles}>
                            <div className="stream-list-wrapper">
                                <div className="cover">&nbsp;</div>
                                <div className="close" onClick={() => {
                                    this.toggle('streamList')
                                }}>&nbsp;</div>
                                <PerfectScrollbar className="container" options={{wheelPropagation: false}}>
                                    <StreamList
                                        streams={this.state.data.streams}
                                        currentStream={this.state.currentStream}
                                        refreshData={this.refreshData}
                                    />
                                </PerfectScrollbar>
                            </div>
                        </nav>
                        <div id="mainbar" className={!this.state.toggles.sidebar ? 'full' : 'with-sidebar'}>
                            <div className="wrapper">
                                <header>
                                    <ControlPanel
                                        toggles={this.state.toggles}
                                        toggleHandler={this.toggle}
                                        streamListCount={this.state.data.streams.length}
                                        websocket={this.state.ws}
                                        wsmessage={this.sendMessage}
                                        currentStream={this.state.currentStream}
                                    />
                                </header>
                                <main>
                                    <HelmetProvider>

                                        <Switch>
                                            <Route path="/login">
                                                <Helmet><title>{this.state.data.title + ': login'}</title></Helmet>
                                                <Login auth={this.state.auth} handler={this.refreshAuth}/>
                                            </Route>
                                            <Route path="/logout">
                                                <Helmet><title>{this.state.data.title + ': logout'}</title></Helmet>
                                                <Logout auth={this.state.auth} handler={this.refreshAuth}/>
                                            </Route>
                                            <Route path="/profile">
                                                <Helmet><title>{this.state.data.title + ': profile'}</title></Helmet>
                                                <Profile auth={this.state.auth} handler={this.refreshAuth}/>
                                            </Route>
                                            <Route path="/password">
                                                <Helmet><title>{this.state.data.title + ': change password'}</title>
                                                </Helmet>
                                                okay :(
                                            </Route>
                                            <Route path="/register">
                                                <Helmet><title>{this.state.data.title + ': registration'}</title>
                                                </Helmet>
                                                <Register auth={this.state.auth} handler={this.refreshAuth}/>
                                            </Route>
                                            <Route path="/stream/:id">
                                                <Stream
                                                    title={this.state.data.title}
                                                    twchat={this.state.toggles.twchat}
                                                    data={this.state.data}
                                                    setCurrentStream={this.setCurrentStream}
                                                />
                                            </Route>
                                            <Route path="/user/:id">
                                                --
                                            </Route>
                                            <Route path="/supply/:id">
                                                <SupplyText/>
                                            </Route>
                                            <Route exact path="/">
                                                <Helmet><title>{this.state.data.title}</title></Helmet>
                                                <Content
                                                    user={this.state.user}
                                                    data={this.state.data}
                                                />
                                            </Route>
                                        </Switch>
                                    </HelmetProvider>
                                </main>
                                <footer>(c) Defiler.ru 1998 forever</footer>
                            </div>
                        </div>
                    </Router>
                </div>
            </>
        )
    }
}

export default App