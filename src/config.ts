/** Stream Browser */
export const streamOptions = {
  twitch: {
    url:
      'https://player.twitch.tv/?channel={channel}&parent=' +
      window.location.hostname,
    chat:
      'https://www.twitch.tv/embed/{channel}/chat?darkpopout&parent=' +
      window.location.hostname,
  },
  afreeca: {
    url: 'https://play.afreecatv.com/{channel}/embed',
  },
  goodgame: {
    url: 'https://goodgame.ru/player?{channel}',
  },
} as const;

export type IStreamSource = keyof typeof streamOptions;

/** API */
export const apiInfo = {
  url: 'https://api.defiler.ru',
  ver: '/api/v0',
  cmd: {
    carrier: '/carrier/attack',
    hello: '/zergling/hello',
    token: '/zergling/token',
    logout: '/zergling/logout',
    register: '/zergling/register',
    profile: '/zergling/profile',
    save: '/zergling/save',
    stream: '/observer/get',
    online: '/observer/online',
    tavern: '/tavern/get',
    supply: '/supply/data/{key}',
  },
} as const;

export function api(cmd: string, key?: number | string | boolean) {
  return apiInfo.url + apiInfo.ver + apiInfo.cmd[cmd] + (key ? '/' + key : '');
}

/** Bunker Chat */
export const bunkerChat = 'https://supply.defiler.ru/chat/';
export const bunkerOrigin = 'https://supply.defiler.ru';

/** Settings */

export const cookieExpires = 30; //in days

// SHOULD BE USED BE SPECIFIED WITHIN `~/.env`
export const grecaptchaKey = 'grecaptcha';

/** Android Talking*/
export const messages = [
  'You were born under a lucky star, little zergling.',
  'Beware, little zergling. Wrong password and you will be desintegrated with my laser cannons! Pew-pew!',
  'Our base is under attack!',
  'Run, little zergling, run! Pew-pew-pew!',
  'My laser cannons become warmer. ',
  'You are not very intelligent, little zerg creature, arent you?',
  'Dont touch my buttons!',
  'Does it activate my laser cannons for desintegrating little zerglings?.. May be.',
  'I am certainly not interested in conversation with you, dirty little thing.',
  'Laser canons! Desintegration!',
  [
    {
      pause: 0,
      text: 'Did you really think that my priceless memory resources would be spent on you, goofy zergling?',
      duration: 3000,
    },
    {
      pause: 0,
      text: 'Your information was just totally desintegrated. Ha-ha.',
      duration: 3000,
    },
  ],
  'Hello, dirty little zergling.',
] as const;

let talkTimer = 0;

export function talk(i: number, x, handler, setProcess, process = -1) {
  if (typeof messages[i] === typeof undefined) return false;
  if (typeof handler !== 'function' || typeof setProcess !== 'function')
    return false;
  if (process >= 0 && (x === 0 || process !== i)) return false;
  // message
  if (typeof messages[i] === 'string') {
    handler(messages[i]);
    return true;
  }
  // script
  if (x === 0) setProcess(i);
  talkTimer = window.setTimeout(() => {
    handler(messages[i][x]['text']);
    talkTimer = window.setTimeout(
      x < messages[i].length - 1
        ? () => {
            talk(i, x + 1, handler, setProcess, i);
          }
        : () => {
            setProcess(-1);
          },
      messages[i][x]['duration'],
    );
  }, messages[i][x]['pause']);
  return true;
}

export function abort() {
  if (talkTimer !== 0) clearTimeout(talkTimer);
}
