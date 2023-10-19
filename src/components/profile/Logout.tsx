import { Form, Formik } from 'formik';
import Cookies from 'universal-cookie';

import { useState } from 'react';

import { Link, Navigate } from 'react-router-dom';

import * as config from '../../config';
import { AuthService } from '../../services/auth.service';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, selectToken } from '../../store/slices/authSlice';

const Logout = () => {
  const token = useAppSelector(selectToken);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>(config.messages[0]);

  const goLogout = () => {
    if (!token) return;
    AuthService.Logout(token, {
      onPending: () => {
        setBusy(true);
      },
      onError: (error: any) => {
        setBusy(false);
        setMessage(config.messages[2]);
        console.log(error);
      },
      onResponse: (res: any) => {
        setMessage(config.messages[3]);
        setBusy(false);
        useAppDispatch(logout());
      },
    });
  };

  if (!token) return <Navigate to="/login" />;

  return (
    <Formik initialValues={{}} onSubmit={goLogout}>
      <Form>
        <div className="advisor">
          <div className="icon"></div>
          <div className="message form-control">{message}</div>
        </div>
        <button type="submit" disabled={busy} className="btn form-control">
          Logout
        </button>
        <Link to="/profile">
          <button type="button" className="btn form-control">
            Profile
          </button>
        </Link>
      </Form>
    </Formik>
  );
};

export default Logout;
