import React from 'react';

import { Link } from 'react-router-dom';

import RepsruNews, { INews } from '../repsru/News';
import RepsruReplays, { IReplay } from '../repsru/Reps';

type IContentProps = {
  user: {
    id: number;
    name: string;
  } | null;
  data: {
    r_news: INews[];
    r_reps: IReplay[];
  };
};

const Content = ({ user, data }: IContentProps) => {
  return (
    <div className="content">
      <div className="user-actions">
        {!user || user.id === -1 ? (
          <>
            <Link to="/login">
              <button type="button" className="btn form-control">
                login
              </button>
            </Link>
            <Link to="/register">
              <button type="button" className="btn form-control">
                register
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile">
              <button type="button" className="btn form-control">
                profile
              </button>
            </Link>
          </>
        )}
      </div>

      <Link to="/supply/dmbook">
        <a>Книга &quot;Дефайлер&quot; (автор: Александр Линник dmb2008)</a>
      </Link>
      <br />
      <br />

      <div className="repsru_content">
        <RepsruNews news={data.r_news} />
        <RepsruReplays replays={data.r_reps} />
        {/*--<div className="buran"> </div>*/}
      </div>
      <a href="./tourney/">
        <img
          src="https://supply.defiler.ru/img/dt/dtour.jpg"
          style={{ width: 250, marginTop: 30 }}
        />
      </a>
      <br />
      <a href="https://discord.gg/pgKarQn" target="_blank" rel="noreferrer">
        discord group
      </a>
    </div>
  );
};

export default Content;
