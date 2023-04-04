import 'core-js'
import "isomorphic-fetch"

import React from "react"
import App from "./components/App"
import ReactDOMClient from 'react-dom/client';

const root = ReactDOMClient.createRoot(document.getElementById('defiler') as Element)
root.render(<App />)