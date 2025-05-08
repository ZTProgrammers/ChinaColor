import { ColorTypes } from "@/stores/useColorType";

import styles from "./ColorTypeBtns.module.css";

interface ColorTypeBtnsProps {
  lastColor: Colors | undefined;
  colorType: ColorTypes;
  setColorType: (value: ColorTypes) => void;
  copyToClipboard: (colors: Colors) => void;
}

const defColorTypes: ColorTypes = {
  hex: false,
  rgb: false,
  cmyk: false,
};

interface ColorTypeBtnProps {
  curValType: () => string;
  curVal: () => string;
  curColor: Colors | undefined;
  val: string;
  onValChanged: () => void;
}

const ColorTypeBtn: React.FC<ColorTypeBtnProps> = ({
  curValType,
  curVal,
  curColor,
  val,
  onValChanged,
}: ColorTypeBtnProps) => {
  const isCur = curValType() == val;

  const ctx = isCur ? curVal() : val;

  const style = isCur ? { color: curColor?.color_color, backgroundColor: curColor?.color_bg } : {};

  return (
    <button className={styles.layoutToggle} onClick={onValChanged} style={style}>
      {ctx}
    </button>
  );
};

export const ColorTypeBtns: React.FC<ColorTypeBtnsProps> = ({
  lastColor,
  colorType,
  setColorType,
  copyToClipboard,
}) => {
  const setHex = (val: false | "Hash" | "NoHash") => {
    setColorType({
      ...defColorTypes,
      hex: val,
    });
  };
  const getHex = () =>
    colorType.hex === "Hash"
      ? lastColor?.color_hex ?? "#zzzzzz"
      : lastColor?.color_hex.replace("#", "") ?? "zzzzzz";

  const setRgb = (val: false | "RGB" | "RGBA") => {
    setColorType({
      ...defColorTypes,
      rgb: val,
    });
  };

  const getRgb = () =>
    colorType.rgb === "RGB"
      ? lastColor?.color_rgb ?? "RGB(r,g,b)"
      : lastColor?.color_rgb.replace("RGB", "RGBA").replace(")", ", 1)") ?? "RGBA(r,g,b,a)";

  const setCmyk = (val: boolean) => {
    setColorType({
      ...defColorTypes,
      cmyk: val,
    });
  };

  const colorTypeKeys = [
    { val: "Hash", onValChanged: () => setHex("Hash"), getCurVal: getHex },
    { val: "NoHash", onValChanged: () => setHex("NoHash"), getCurVal: getHex },
    { val: "RGB", onValChanged: () => setRgb("RGB"), getCurVal: getRgb },
    { val: "RGBA", onValChanged: () => setRgb("RGBA"), getCurVal: getRgb },
    {
      val: "CMYK",
      onValChanged: () => setCmyk(true),
      getCurVal: () => lastColor?.color_cmyk ?? "CMYK(c,m,y,k)",
    },
  ];

  const getCurKey = () => {
    if (colorType.hex !== false) {
      return colorType.hex;
    }

    if (colorType.rgb !== false) {
      return colorType.rgb;
    }

    if (colorType.cmyk !== false) {
      return "CMYK";
    }

    return "Hash";
  };

  // const getCurVal = () => {};

  return (
    <div className={styles.ctxtop}>
      <div className={styles.ctx}>
        {colorTypeKeys.map((item) => (
          <ColorTypeBtn
            key={item.val}
            curValType={getCurKey}
            curVal={item.getCurVal}
            curColor={lastColor}
            val={item.val}
            onValChanged={() => {
              if (getCurKey() == item.val) {
                if (lastColor) {
                  copyToClipboard(lastColor);
                }
              } else {
                item.onValChanged();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
