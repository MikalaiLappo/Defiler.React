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

import React, {Component, useEffect, useRef, useState} from "react"
import {Helmet, HelmetProvider} from 'react-helmet-async'
import Cookies from 'universal-cookie'
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

import '../styles/index.scss'
import * as config from "../config"
import * as test from "../data"
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

const App = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [auth, setAuth] = useState<boolean | string>(false)
    const [user, setUser] = useState<boolean | {name: string, id: number}>(false) // ANY
    const [toggles, setToggles] = useState({
        sidebar: window.innerWidth >= 800,
        twchat: false,
        refinery: false,
        streamList: window.innerWidth >= 1400,
    })
    const [bunkerChat, setBunkerChat] = useState<boolean>(true)
    const [currentStream, setCurrentStream] = useState<boolean>(true)
    const [data, setData] = useState<any>({title: 'Defi'}) // ANY
    const DWSSRef = useRef<null | typeof DefilerWebSocketServer>(null)

    const toggle = (k: keyof typeof toggles) =>  {
        setToggles(prevState => ({...prevState, [k]: !prevState[k]}) )
    }
    
    const updateDimensions = () => {
        //this.setState({ width: window.innerWidth, height: window.innerHeight })
        //style changes?
    }

    useEffect(() => {
        if (window.innerWidth < 800) setToggles(prev => ({...prev, sidebar: false}) )
        window.addEventListener('resize', updateDimensions)
        refreshAuth()
        refreshData()

        window.addEventListener('message', event => {
            if (!event.origin.startsWith(config.bunkerOrigin)) return
            if (event.data === 'supply-chat-close') toggle('sidebar')
            if (event.data === 'supply-chat-switch') setBunkerChat(false)
        }, false);
    

        return () => window.removeEventListener('resize', updateDimensions)
    }, [])
    
    const refreshAuth = () => {
        const
            cookies = new Cookies(),
            authKey = cookies.get('DefilerAuthKey')
        setAuth(typeof authKey !== typeof undefined ? authKey : false)
        
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
                setUser({'id': data.id, 'name': data.name})
                if (data.id <= 0) {
                    cookies.remove('DefilerAuthKey')
                    setAuth(false)
                }
            })
            .catch((e) => {
                console.log(e)
            });
    }

    const refreshData = (dataField = 'carrier', command: boolean | string | undefined = false) => {
        //console.log(dataField)
        if (command === false) command = dataField
        fetch(config.api(command.toString()), {
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
                    if (dataField === 'carrier') {
                        setLoading(false)
                        setData(data)
                    }
                    else
                        setData(prevState => ({...prevState, [dataField]: data}))
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

    const sendMessage = () => console.info(`TODO: implement "sendMessage"`)

    if (loading) return (<></>)

    if (document.getElementById("loading-cover")) {
        document.getElementById("loading-cover")!.outerHTML = ''
    }

    return <>
         <div id="page-container">
              <Router>
                 <nav id="sidebar" className={!toggles.sidebar ? 'hidden' : ''}>
                {
                    bunkerChat
                        ? <Bunker auth={auth}/>
                        :
                        <Chat
                            auth={auth}
                            user={user}
                            messages={data.tavern}
                            refreshData={refreshData}
                            ws={DWSSRef}
                            closeToggle={() => toggle('sidebar')}
                            switchToggle={bunkerChat}
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
            <nav id="stream-list" className={!toggles.streamList ? 'hidden' : ''}
                 key={toggles.toString()}> {/* TODO: make sure wheather the key needed at all */}
                <div className="stream-list-wrapper">
                    <div className="cover">&nbsp;</div>
                    <div className="close" onClick={() => {
                        toggle('streamList')
                    }}>&nbsp;</div>
                    <PerfectScrollbar className="container" options={{wheelPropagation: false}}>
                        <StreamList
                            streams={data.streams}
                            currentStream={currentStream}
                            refreshData={refreshData}
                        />
                    </PerfectScrollbar>
                </div>
            </nav>
            <div id="mainbar" className={!toggles.sidebar ? 'full' : 'with-sidebar'}>
                <div className="wrapper">
                    <header>
                        <ControlPanel
                            toggles={toggles}
                            toggleHandler={toggle}
                            streamListCount={data.streams?.length} /* TODO: maybe refactor after `data` typings */
                            websocket={DWSSRef}
                            wsmessage={sendMessage}
                            currentStream={currentStream}
                        />
                    </header>
                    <main>
                        <HelmetProvider>

                            <Routes>
                                <Route path="/login">
                                    <Helmet><title>{data.title + ': login'}</title></Helmet>
                                    <Login auth={auth} handler={refreshAuth}/>
                                </Route>
                                <Route path="/logout">
                                    <Helmet><title>{data.title + ': logout'}</title></Helmet>
                                    <Logout auth={auth} handler={refreshAuth}/>
                                </Route>
                                <Route path="/profile">
                                    <Helmet><title>{data.title + ': profile'}</title></Helmet>
                                    <Profile auth={auth} handler={refreshAuth}/>
                                </Route>
                                <Route path="/password">
                                    <Helmet><title>{data.title + ': change password'}</title>
                                    </Helmet>
                                    okay :(
                                </Route>
                                <Route path="/register">
                                    <Helmet><title>{data.title + ': registration'}</title>
                                    </Helmet>
                                    <Register auth={auth} handler={refreshAuth}/>
                                </Route>
                                <Route path="/stream/:id">
                                    <Stream
                                        title={data.title}
                                        twchat={toggles.twchat}
                                        data={data}
                                        setCurrentStream={setCurrentStream}
                                    />
                                </Route>
                                <Route path="/user/:id">
                                    --
                                </Route>
                                <Route path="/supply/:id">
                                    <SupplyText/>
                                </Route>
                                <Route path="/">
                                    <Helmet><title>{data.title}</title></Helmet>
                                    <Content
                                        user={user}
                                        data={data}
                                    />
                                </Route>
                            </Routes>
                        </HelmetProvider>
                    </main>
                    <footer>(c) Defiler.ru 1998 forever</footer>
                </div>
            </div>
        </Router>
    </div>
</>
    
}

export default App

