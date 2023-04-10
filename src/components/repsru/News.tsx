import reactPreset from '@bbob/preset-react/es';
import BBCode from '@bbob/react/es/Component';

import React from 'react';

export interface INews {
  id: number;
  title: string;
  content: string;
  previewImg: string;
  previewImgFull: string;
  previewContent: string;
  createdAt: Date;
}

interface INewsRepsonse {
  news: INews[];
}

type RepsruNewsProps = INewsRepsonse;
const RepsruNews = ({ news }: RepsruNewsProps) => {
  if (news.length == 0) return <></>;

  const newsList = news.map((post, index) => {
    return (
      <div className="item" key={index}>
        <span className="start"> {'>>'} </span>
        <a
          href={'https://reps.ru/news/' + post.id}
          target="_blank"
          rel="noreferrer"
        >
          {post.title}
        </a>
        <br />
        <p>
          <BBCode
            plugins={[reactPreset()]}
            options={{ onlyAllowTags: ['i', 'b', 'u', 'url'] }}
          >
            {post.previewContent}
          </BBCode>
        </p>
      </div>
    );
  });

  return (
    <div className="repsru_news">
      <h4>news.</h4>
      {newsList}
    </div>
  );
};

export default RepsruNews;
