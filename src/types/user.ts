export type IRace = 'terran' | 'zerg' | 'protoss' | 'random';

/**
 * model according (legacy?) api i.e. `/auth.php` response
 */
export type IUser = {
  id: string; // actually a `number` but in `string` type
  nick: string;
};

/**
 * (response) model according to `/api/v0/zergling/hello`
 */
export type IHello = {
  code: number; // http response code
  id: number;
  ip: string;
  loggedIn: boolean;
  message: string;
  name: string;
};

/**
 * response) model according to `/api/v0/zergling/profile`
 */
export type IProfile = {
  success: boolean; // http response status
  id: number;
  name: string;
  message: string; // `'Profile'`
  data: {
    aka: string;
    race: IRace;
    email: string;
  };
  code: boolean; // http response code
};
