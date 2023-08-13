import { FC } from 'react';

import { Route } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';

import Login from './Login';
import Logout from './Logout';
import Profile from './Profile';
import Register from './Register';

type TProfileRouteProps = {
  path: string;
  title: string;
  auth: string | null;
  callback: () => void;
};

const LoginRoute: FC<TProfileRouteProps> = ({
  path,
  title,
  auth,
  callback,
}) => (
  <Route path={path}>
    <>
      <Helmet>
        <title>{title + ': login'}</title>
      </Helmet>
      <Login auth={auth} handler={callback} />
    </>
  </Route>
);

const LogoutRoute: FC<TProfileRouteProps> = ({
  path,
  title,
  auth,
  callback,
}) => (
  <Route
    path={path}
    element={
      <>
        <Helmet>
          <title>{title + ': logout'}</title>
        </Helmet>
        <Logout auth={auth} handler={callback} />
      </>
    }
  />
);

const ProfileRoute: FC<TProfileRouteProps> = ({
  path,
  title,
  auth,
  callback,
}) => (
  <Route
    path={path}
    element={
      <>
        <Helmet>
          <title>{title + ': profile'}</title>
        </Helmet>
        <Profile auth={auth} handler={callback} />
      </>
    }
  />
);

const PasswordRoute: FC<TProfileRouteProps> = ({
  path,
  title,
  auth,
  callback,
}) => (
  <Route
    path={path}
    element={
      <>
        <Helmet>
          <title>{title + ': change password'}</title>
        </Helmet>
        okay :(
      </>
    }
  />
);

const RegisterRoute: FC<TProfileRouteProps> = ({
  path,
  title,
  auth,
  callback,
}) => (
  <Route
    path={path}
    element={
      <>
        <Helmet>
          <title>{title + ': registration'}</title>
        </Helmet>
        <Register auth={auth} handler={callback} />
      </>
    }
  />
);

export { LoginRoute, LogoutRoute, ProfileRoute, PasswordRoute, RegisterRoute };
