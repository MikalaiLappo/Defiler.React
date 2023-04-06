import reactPreset from '@bbob/preset-react/es';
import BBCode from '@bbob/react/es/Component';

import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { Link, Redirect } from 'react-router-dom';

import * as config from '../../config';

export default function SupplyText(props) {
  const { id } = useParams(),
    [text, setText] = React.useState('...');

  const preset = reactPreset.extend((tags, options) => ({
    ...tags,
    l: (node) => ({
      tag: 'span',
      attrs: {
        className: 'red-letter',
      },
      content: node.content,
    }),
  }));

  useEffect(() => {
    fetch(config.api('supply').replace(/{key}/gi, id), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.data === 'undefined') return;
        let p = data.data.split('\n'),
          r = '';
        p.forEach((el) => {
          el = el.trim();
          r += '\n';
          if (el.length <= 1) return;
          r += '[l]' + el.substr(0, 1) + '[/l]' + el.substr(1);
        });
        setText(r);
      })
      .catch((e) => {
        console.log(e);
      });
  });

  return (
    <div className="content">
      <h4></h4>
      <div className="book">
        <BBCode
          plugins={[preset()]}
          options={{ onlyAllowTags: ['i', 'b', 'u', 'l'] }}
        >
          {text}
        </BBCode>
      </div>
    </div>
  );
}
