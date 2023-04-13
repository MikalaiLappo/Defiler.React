import reactPreset from '@bbob/preset-react/es';
import BBCode from '@bbob/react/es/Component';

import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import * as config from '../../config';

const SupplyText = () => {
  const { idParam } = useParams();
  const [text, setText] = useState('...');

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
    if (!idParam) {
      console.warn('`id` param unspecified');
      return;
    }

    fetch(config.api('supply').replace(/{key}/gi, idParam), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data.data === 'undefined') return;
        const p = data.data.split('\n');
        let r = '';
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
};

export default SupplyText;
