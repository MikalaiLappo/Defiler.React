import { addDays } from 'date-fns';
import { Form, Formik } from 'formik';
import Cookies from 'universal-cookie';
import * as Yup from 'yup';

import { useState } from 'react';

import { Navigate } from 'react-router-dom';
//import ru from "date-fns/locale/ru"
import { Link } from 'react-router-dom';

import * as config from '../../config';
import { AuthService, TLoginData } from '../../services/auth.service';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, selectToken } from '../../store/slices/authSlice';
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

const Login = () => {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>(config.messages[1]);
  const token = useAppSelector(selectToken);

  const goLogin = (formValues: TLoginData) => {
    AuthService.Login(formValues, {
      onPending: () => {
        setBusy(true);
        setMessage('...');
      },
      onSuccess: (resp: any) => {
        console.log('SUCCESS LOGIN');
        setBusy(false);
        setMessage(config.messages[0]);
        console.log(resp);
        //
        useAppDispatch(login(resp.token));
        //props.handler();
      },
      onInvalid: (response: any) => {
        setBusy(false);
        setMessage(config.messages[4] + response.message);
      },
      onError: (error: any) => {
        setBusy(false);
        setMessage(config.messages[2]);
        console.log(error);
      },
    });
  };

  if (token) return <Navigate to="/logout" />;

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
