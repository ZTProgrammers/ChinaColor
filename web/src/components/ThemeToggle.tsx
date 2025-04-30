import React from "react";
import { useTheme } from "@/stores/useTheme";
import { Button } from "antd";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.themeToggle}>
      <Button type={theme === "light" ? "primary" : "default"} onClick={() => setTheme("light")}>
        浅色
      </Button>
      <Button
        color="gold"
        type={theme === "dark" ? "primary" : "default"}
        onClick={() => setTheme("dark")}>
        深色
      </Button>
      <Button type={theme === "system" ? "primary" : "default"} onClick={() => setTheme("system")}>
        跟随系统
      </Button>
    </div>
  );
};
