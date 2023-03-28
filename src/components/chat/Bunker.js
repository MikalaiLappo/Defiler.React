// Reserve chat

/*

//TODO проблема мобилки
.my-element {
    height: 100vh; // Fallback for browsers that do not support Custom Properties
    height: calc(var(--vh, 1vh) * 100);
}

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});


You could try the vh (viewport height) unit in your min-height style.
<section style="width: 100%; min-height: 100vh">
</section>

Another option would be to use calc().
<section style="width: 100%; height: calc(100%);">
</section>
*/


import React, {useState, useEffect} from "react"
import Iframe from 'react-iframe'

import * as config from "../../config"

export default function Bunker(props) {
    const
        msgToBunker = function () {
            const frame = document.getElementById('lisy-chat');
            frame.contentWindow.postMessage('hello from dev.defiler.ru', 'https://supply.defiler.ru');
        }

    useEffect(() => {

    }, [])

    return (
        <Iframe
            id="lisy-chat"
            src={config.bunkerChat + '?auth=' + props.auth}
            width="100%"
            height="100%"
            frameBorder={0}
            scrolling="no"
        />
    )
}