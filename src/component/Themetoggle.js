import React from "react";
import "../App.css";
import ToggleTheme from "react-toggle-theme";

function Themetoggle() {
  const [currentTheme, setCurrentTheme] = React.useState(
    `${localStorage.currentTheme}`
  );

  //available themes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeMap = {
    dark: "dark",
    light: "light",
  };

  //setting the theme on loan
  const tmp = Object.keys(themeMap)[0];
  const theme =
    localStorage.getItem("currentTheme") ||
    (tmp, localStorage.setItem("currentTheme", tmp), tmp);

  const bodyClass = document.body.classList;
  bodyClass.add(theme);

  //On toggle event
  React.useEffect(() => {
    const current = localStorage.getItem("currentTheme");
    const next = themeMap[currentTheme];
    bodyClass.replace(current, next);
    localStorage.setItem("currentTheme", next);
  }, [bodyClass, currentTheme, themeMap]);
  return (
    <div
      className={"app-container"}
      style={{
        top: "0",
        right: "0",
        margin: "0em 1.5em",
        padding: ".5em .5em",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        zindex: "999",
        transition: "top .3s ease",
        position: "absolute",
      }}
    >
      <ToggleTheme selectedTheme={currentTheme} onChange={setCurrentTheme} />
      <span style={{ margin: "auto", paddingLeft: "7px" }}>
        {currentTheme === "light" ? "Dark" : "Light"}
      </span>
    </div>
  );
}

export default Themetoggle;
