import { addDays } from 'date-fns';
import { Form, Formik } from 'formik';
import Cookies from 'universal-cookie';
import * as Yup from 'yup';

import React, { useState } from 'react';

import { Navigate } from 'react-router-dom';
//import ru from "date-fns/locale/ru"
import { Link } from 'react-router-dom';

import * as config from '../../config';
import InputRegion from '../elements/InputRegion';

const formInitialValues = {
  login: '',
  password: '',
  rememberMe: false,
};

const formSchema = Yup.object().shape({
  login: Yup.string().required('Login required').max(64, '64 symbols max'),
  password: Yup.string()
    .required('Password required')
    .min(4, '4 symbols min')
    .max(64, '64 symbols max'),
  rememberMe: Yup.boolean(),
});

type ILoginProps = { auth: string | null; handler: () => void };
const Login = (props: ILoginProps) => {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>(config.messages[1]);

  const goLogin = (formValues, e) => {
    const cookies = new Cookies(),
      now = new Date(),
      expires = addDays(now, config.cookieExpires),
      cookieOptions = formValues.rememberMe
        ? { expires: expires, path: '/' }
        : { path: '/' };
    setBusy(true);
    setMessage('...');
    fetch(config.api('token'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBusy(false);
          setMessage(config.messages[0]);
          cookies.set('DefilerAuthKey', data.token, cookieOptions);
          props.handler();
        } else {
          setBusy(false);
          setMessage(config.messages[4] + data.message);
        }
      })
      .catch((e) => {
        setBusy(false);
        setMessage(config.messages[2]);
        console.log(e);
      });
  };

  if (props.auth) return <Navigate to="/logout" />;

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={formSchema}
      onSubmit={goLogin}
    >
      {({ errors, status, touched, values }) => (
        <Form>
          <div className="advisor">
            <div className="icon"></div>
            <div className="message form-control">{message}</div>
          </div>
          <InputRegion
            id="login"
            prepend="login:"
            name="login"
            type="text"
            value={values.login || ''}
            isError={!!(errors.login && touched.login)}
          />
          <InputRegion
            id="password"
            prepend="password:"
            name="password"
            type="password"
            value={values.password || ''}
            isError={!!(errors.password && touched.password)}
          />
          <InputRegion
            id="rememberMe"
            prepend="remember:"
            name="rememberMe"
            type="checkbox"
            checked={values.rememberMe || false}
            isError={!!(errors.rememberMe && touched.rememberMe)}
          />
          <button type="submit" disabled={busy} className="btn form-control">
            Login
          </button>
          <Link to="/register">
            <button type="button" className="btn form-control">
              Registration
            </button>
          </Link>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
