import { addDays } from 'date-fns';
import Cookies from 'universal-cookie';

import * as config from '../config';

export type TLoginData = {
  login: string;
  password: string;
  rememberMe: boolean;
};

export type TStageCBs = {
  onPending: () => void;
  onSuccess: (response?: any) => void;
  onInvalid: (response?: any) => void;
  onError: (response?: any) => void;
};

class AuthService {
  public static Login(
    formValues: TLoginData,
    { onPending, onSuccess, onError, onInvalid }: TStageCBs,
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
          cookies.set('DefilerAuthKey', data.token, cookieOptions);
          onSuccess(data);
        } else {
          onInvalid();
        }
      })
      .catch((e) => {
        onError();
      });
  }
}

export { AuthService };
