import { useRef } from "react";

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
