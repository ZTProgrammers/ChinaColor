import { useState } from "react";

const lsKey = "CardLayoutType";

export function useCardLayoutType(): [boolean, (val: boolean) => void] {
  const [value, setValue] = useState(() => localStorage.getItem(lsKey) === "true");

  const cardLayoutType = value;

  function setCardLayoutType(val: boolean) {
    localStorage.setItem(lsKey, val ? "true" : "false");
    setValue(val);
  }

  return [cardLayoutType, setCardLayoutType];
}
