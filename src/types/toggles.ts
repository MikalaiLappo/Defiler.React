export interface IToggles {
  sidebar: boolean;
  twchat: boolean;
  refinery: boolean;
  streamList: boolean;
}

export type IToggleHandler = (t: keyof IToggles) => void;
