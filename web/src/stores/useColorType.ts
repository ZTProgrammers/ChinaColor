import { useState } from "react";

export interface ColorTypes {
  hex: false | "Hash" | "NoHash";
  rgb: false | "RGB" | "RGBA";
  cmyk: boolean;
}
const lsKey = "ColorTypes";
function getls(): ColorTypes {
  const colorTypes_str = localStorage.getItem(lsKey);
  if (colorTypes_str) {
    const colorTypes = JSON.parse(colorTypes_str) as ColorTypes;

    if (colorTypes) {
      return colorTypes;
    }
  }

  return {
    hex: "Hash",
    rgb: false,
    cmyk: false,
  };
}

export function useColorType(): [ColorTypes, (val: ColorTypes) => void] {
  const [value, setValue] = useState(getls);

  const colorType = value;

  function setColorType(val: ColorTypes) {
    localStorage.setItem(lsKey, JSON.stringify(val));
    setValue(val);
  }

  return [colorType, setColorType];
}
