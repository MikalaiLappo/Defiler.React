import { Form, Formik } from 'formik';
import Cookies from 'universal-cookie';

import React, { useState } from 'react';

import { Link, Navigate } from 'react-router-dom';

import * as config from '../../config';

type ILogoutProps = { auth: string | null; handler: () => void };
const Logout = (props: ILogoutProps) => {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>(config.messages[0]);

  const goLogout = () => {
    setBusy(true);
    fetch(config.api('logout'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auth: props.auth }),
    })
      .then((response) => response.json())
      .then(() => {
        const cookies = new Cookies();
        setMessage(config.messages[3]);
        cookies.remove('DefilerAuthKey');
        setBusy(false);
        props.handler();
      })
      .catch((e) => {
        setBusy(false);
        setMessage(config.messages[2]);
        console.log(e);
      });
  };

  if (!props.auth) return <Navigate to="/login" />;

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
