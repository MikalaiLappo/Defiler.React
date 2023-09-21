import { addDays } from 'date-fns';
import Cookies from 'universal-cookie';

import * as config from '../config';
import { Token } from '../store/slices/authSlice';

export type TLoginData = {
  login: string;
  password: string;
  rememberMe: boolean;
};

export type LoginStages = {
  onPending: () => void;
  onSuccess: (response?: any) => void;
  onInvalid: (response?: any) => void;
  onError: (response?: any) => void;
};

export type LogoutStages = {
  onPending: () => void;
  onResponse: (response?: any) => void;
  onError: (response?: any) => void;
};

class AuthService {
  public static Login(
    formValues: TLoginData,
    { onPending, onSuccess, onError, onInvalid }: LoginStages,
  ) {
    onPending();

    const cookies = new Cookies();
    const now = new Date();
    const expires = addDays(now, config.cookieExpires);
    const cookieOptions = formValues.rememberMe
      ? { expires: expires, path: '/' }
      : { path: '/' };

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
          /** hardcoded core stuff */
          cookies.set('DefilerAuthKey', data.token, cookieOptions);
          /** core stuff end */
          onSuccess(data);
        } else {
          onInvalid();
        }
      })
      .catch(onError);
  }

  public static Logout(
    token: Token,
    { onPending, onError, onResponse }: LogoutStages,
  ) {
    onPending();
    fetch(config.api('logout'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ auth: token }),
    })
      .then((response) => response.json())
      .then(() => {
        /** hardcoded core stuff */
        const cookies = new Cookies();
        cookies.remove('DefilerAuthKey');
        /** core stuff end */
        onResponse();
      })
      .catch(onError);
  }
}

export { AuthService };
