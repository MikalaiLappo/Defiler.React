/*
import React from "react";
import { render } from "react-dom";

import reactRender from "@bbob/react/es/render";
import reactPreset from "@bbob/preset-react/es";

const preset = reactPreset.extend((tags, options) => ({
  zz: node => ({
    tag: "i",
    className: "red",
    attrs: {className: "op", style: {color: "red"}},
    content: node.content
  })
}));

const toReact = input => reactRender(input, preset());

const text = toReact(
  "[zz]some text[/zz][b]Super [i]easy[/i][/b] [u]to[/u] render"
);

const App = ({ renderProp }) => <span>{text}</span>;

const rootElement = document.getElementById("root");
render(<App />, rootElement);

 */

type IPart = {
  tag: string;
  class: string;
  src: string;
  text: string;
  handler?: () => void;
};
type ITextBuilderProps = {
  handler?: () => void;
  text: string;
  insertPic: () => void;
  insertName: () => void;
};
export default function TextBuilder(props: ITextBuilderProps) {
  function insertPart(parts: IPart[], x, data, before: string, after: string) {
    const newParts: IPart[] = [];
    for (let j = 0; j < x; j++) newParts.push(parts[j]);
    if (before !== '') {
      newParts.push({
        tag: '',
        class: '',
        src: '',
        text: before,
        handler: undefined,
      });
    }
    newParts.push(data);
    if (after !== '')
      newParts.push({
        tag: '',
        class: '',
        src: '',
        text: after,
      });
    for (let j = x + 1; j < parts.length; j++) newParts.push(parts[j]);
    return newParts;
  }

  const dividers = ' `!@#$%^&*()[]{}:;\'",.<>?/\\|-+=',
    nickSymbols = '()[]{}.-_',
    maxPicCount = 5,
    pics = [
      {
        code: ':boris:',
        img: 'http://defiler.ru/chat/smiles-hidden/0-pics/boris.jpg',
      },
      {
        code: ':happy:',
        img: 'http://defiler.ru/chat/smiles-hidden/3-gif/happy.gif',
      },
      {
        code: ':pistoletov:',
        img: 'http://defiler.ru//chat/smiles-hidden/0-pics/pistoletov.jpeg',
      },
    ];

  let parts: IPart[] = [
    {
      tag: '',
      class: '',
      src: '',
      text: props.text,
    },
  ];
  let x = 0;
  let e = 0;

  // pics
  let picCount = 0;
  while (x < parts.length) {
    if (e++ >= 100) break;
    if (picCount >= maxPicCount) break;
    if (parts[x].tag === '')
      for (let i = 0; i < pics.length; i++) {
        const p = parts[x].text.indexOf(pics[i].code);
        if (p !== -1) {
          picCount++;
          parts = insertPart(
            parts,
            x,
            {
              tag: 'img',
              class: 'chat-pic',
              src: pics[i].img,
              text: pics[i].code,
              handler: props.insertPic,
            },
            parts[x].text.slice(0, p),
            parts[x].text.slice(p + pics[i].code.length),
          );
          x--;
          break;
        }
      }
    x++;
  }
  // nicknames
  x = 0;
  e = 0;
  while (x < parts.length) {
    if (e++ >= 100) break;
    if (parts[x].tag === '') {
      const p = parts[x].text.indexOf('@');
      if (p >= 0 && (p === 0 || dividers.includes(parts[x].text[p - 1]))) {
        let name = '';
        for (let i = p + 1; i < parts[x].text.length; i++) {
          if (
            dividers.includes(parts[x].text[i]) &&
            !nickSymbols.includes(parts[x].text[i])
          )
            break;
          name += parts[x].text[i];
        }
        if (name !== '') {
          parts = insertPart(
            parts,
            x,
            {
              tag: 'span',
              class: 'chat-nick',
              src: '',
              text: '@' + name,
              handler: props.insertName,
            },
            parts[x].text.slice(0, p),
            parts[x].text.slice(p + name.length + 1),
          );
          x--; // ?
        }
      }
    }
    x++;
  }
  const building = parts.map((part, index) => {
    switch (part.tag) {
      case 'img':
        return (
          <img
            key={index}
            className={part.class}
            src={part.src}
            alt={part.text}
            onClick={part.handler}
          />
        );
      case 'span':
        return part.handler ? (
          <a key={index} className={part.class} onClick={part.handler}>
            {part.text}
          </a>
        ) : (
          <span key={index} className={part.class}>
            {part.text}
          </span>
        );
      default:
        return <span key={index}>{part.text}</span>;
    }
  });

  return <>{building}</>;
}
