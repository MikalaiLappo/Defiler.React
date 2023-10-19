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
import Iframe from 'react-iframe';
import { useSelector } from 'react-redux';

import * as config from '../../config';
import { selectToken } from '../../store/slices/authSlice';

const Bunker = () => {
  const token = useSelector(selectToken);

  const msgToBunker = () => {
    const frame = document.getElementById('lisy-chat');
    (frame as HTMLIFrameElement)?.contentWindow?.postMessage(
      'hello from dev.defiler.ru',
      'https://supply.defiler.ru',
    );
  };

  return (
    <Iframe
      id="lisy-chat"
      url={config.bunkerChat + '?auth=' + (token || '')}
      width="100%"
      height="100%"
      frameBorder={0}
      scrolling="no"
    />
  );
};

export default Bunker;
