import {
  assignVars,
  createGlobalTheme,
  createGlobalThemeContract,
  globalStyle,
} from "@vanilla-extract/css";

//contract -> 이름 정하는 함수
export const global = createGlobalThemeContract({
  background: {
    color: "bg-color",
  },
  foreground: {
    color: "fg-color",
  },
});

const whiteGlobalTheme = {
  background: {
    color: "rgb(255, 255, 255)",
  },
  foreground: {
    color: "rgb(0, 0, 0)",
  },
};
const darkGlobalTheme = {
  background: {
    color: "rgb(0, 0, 0)",
  },
  foreground: {
    color: "rgb(255, 255, 255)",
  },
};

createGlobalTheme(":root", global, whiteGlobalTheme);

globalStyle(":root", {
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: assignVars(global, darkGlobalTheme),
    },
  },
});
globalStyle("*", {
  boxSizing: "border-box",
  padding: 0,
  margin: 0,
});
globalStyle("html", {
  "@media": {
    "(prefers-color-scheme: dark)": {
      colorScheme: "dark",
    },
  },
});
globalStyle("html, body", {
  maxWidth: "100dvw",
  overflowX: "hidden",
});
globalStyle("body", {
  color: global.foreground.color,
});
globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});
