import { useRef, useState } from 'react';

//create your forceUpdate hook
export function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => ++value); // update the state to force render
}

export const useFocus = (): [
  React.MutableRefObject<HTMLElement | null>,
  () => void,
] => {
  const htmlElRef = useRef<HTMLElement | null>(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };
  return [htmlElRef, setFocus];
};
