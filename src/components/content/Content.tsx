import { Link } from 'react-router-dom';

import { IUser } from '../../types/user';

type IContentProps = {
  user: IUser;
};

const Content = ({ user }: IContentProps) => {
  return (
    <div className="content">
      <div className="user-actions">
        {!user || +user.id === -1 ? (
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

      <a href="//reps.ru" target="_blank" rel="noreferrer">
        <div className="repsru_content"></div>
      </a>
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
