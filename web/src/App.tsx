import React, { useState } from "react";
import { Card, message } from "antd";
import colorsData from "@/data/colors.json";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./App.module.css";
import { useCardLayoutType } from "@/stores/useCardLayoutType";
import { useColorType } from "./stores/useColorType";
import { ColorTypeBtns } from "./components/ColorTypeBtns";

const defBor = "transparent";

const AppContent: React.FC = () => {
  // 添加选中颜色状态管理
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});
  const [isGridLayout, setIsGridLayout] = useCardLayoutType();
  const [colorType, setColorType] = useColorType();

  const [lastColor, setLastColor] = useState<Colors>();

  const [messageApi, contextHolder] = message.useMessage();

  const toggleLayout = () => {
    setIsGridLayout(!isGridLayout);
  };

  function getColors(color: Colors): string[] {
    const ret: string[] = [];

    if (colorType.hex === "Hash") {
      ret.push(color.color_hex);
    } else if (colorType.hex === "NoHash") {
      ret.push(color.color_hex.replace("#", ""));
    }

    if (colorType.rgb === "RGB") {
      ret.push(color.color_rgb);
    } else if (colorType.rgb === "RGBA") {
      ret.push(color.color_rgb.replace("RGB", "RGBA").replace(")", ", 1)"));
    }

    if (colorType.cmyk === true) {
      ret.push(color.color_cmyk);
    }

    if (ret.length === 0) {
      setColorType({
        ...colorType,
        hex: "Hash",
      });
      ret.push(color.color_hex);
    }

    return ret;
  }

  const copyToClipboardCore = (color: Colors, colorValue: string[]) => {
    const style = {
      color: color.color_color,
      backgroundColor: color.color_bg,
      padding: "2px 12px",
    };

    navigator.clipboard
      .writeText(colorValue.join("\n"))
      .then(() => {
        messageApi.success({
          className: styles.messagebox,
          content: (
            <>
              颜色值已复制到剪贴板！
              <span style={style}>{colorValue.join(", ")}</span>
            </>
          ),
        });
      })
      .catch(() => {
        message.error("复制失败，请重试");
      });
  };

  const copyToClipboard = (color: Colors, seasonTitle: string) => {
    const colorValue = getColors(color);

    if (color.color_hex !== lastColor?.color_hex) {
      setLastColor(color);
      setCardColor(color.color_hex, seasonTitle);
    }

    copyToClipboardCore(color, colorValue);
  };

  const copyToClipboardAgain = () => {
    if (!lastColor) {
      return;
    }
    copyToClipboardCore(lastColor, getColors(lastColor));
  };

  const setCardColor = (color: string, seasonTitle: string) => {
    // 更新选中的颜色
    setSelectedColors((prev) => ({
      ...prev,
      [seasonTitle]: color,
    }));
  };

  const ClearCardColor = () => {
    colorsData.forEach((c) => {
      setCardColor(defBor, c.title);
    });
  };

  return (
    <>
      {contextHolder}
      <div className={styles.appContainer}>
        <h1 className={styles.mainTitle} onClick={ClearCardColor}>
          中国传统色彩
        </h1>
        <div className={styles.layoutToggleDiv}>
          <button
            onClick={toggleLayout}
            className={styles.layoutToggle}>
            {isGridLayout ? "切换为列表视图" : "切换为网格视图"}
          </button>
          <span style={{ color: "var(--text-color)" }}>|</span>
          <ColorTypeBtns lastColor={lastColor} colorType={colorType} setColorType={setColorType} copyToClipboard={copyToClipboardAgain} />
        </div>
        <div className={`${styles.cardGrid} ${isGridLayout ? styles.gridLayout : ""}`}>
          {colorsData.map((season) => (
            <Card
              key={season.title}
              title={
                <div className={styles.seasonTitle} onClick={() => setCardColor(defBor, season.title)}>
                  {season.title}
                  <span className={styles.seasonTitleEn}>({season.engtitle})</span>
                </div>
              }
              className={styles.seasonCard}
              style={{
                borderColor: selectedColors[season.title] || undefined,
              }}>
              <p className={styles.seasonDescription}>{season.des}</p>
              <div className={styles.colorGrid}>
                {season.colorDatas?.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => copyToClipboard(color, season.title)}
                    className={styles.colorCard}
                    style={{
                      backgroundColor: color.color_bg,
                      color: color.color_color,
                    }}>
                    <div className={styles.colorName}>
                      {color.color_name} &nbsp; {color.color_hex}
                    </div>
                    <div className={styles.colorValue}>{color.color_rgb}</div>
                    <div className={styles.colorValue}>{color.color_cmyk}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
      <ThemeToggle />
    </ThemeProvider>
  );
};

export default App;
