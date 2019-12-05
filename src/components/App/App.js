// Npm Modules
import React from "react";
import swal from "sweetalert";
import { css } from "emotion";

// Local Modules
import EmployeesTable from "../EmployeesTable/EmployeesTable";
import NightModeSwitch from "../NightModeSwitch/NightModeSwitch";

// Local css imports
import "./App.css";

// Assets
import apiURL from "./helpers/apiUrlGetter";

class App extends React.Component {
  theme = JSON.parse(localStorage.getItem("theme"));
  state = { theme: this.theme, component: "" };
  flipflopValue = this.state.theme;

  componentDidMount() {
    this.triggerThemeSwap();
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log(error);
    return { hasError: true };
  }

  triggerThemeSwap = e => {
    const isWhiteMode = this.flipflopValue;
    localStorage.setItem("theme", isWhiteMode);

    // :REDFLAG: do not target the DOM directly, but this is the best way for Dark Theme
    document.documentElement.style.background = isWhiteMode ? "#222222" : "";
    this.setState({
      component: css({
        color: isWhiteMode ? "white" : "dark",
        darkMode: !isWhiteMode
      })
    });
    this.flipflopValue = !this.flipflopValue;
  };

  globalAlerts(message) {
    // passed down to child components to display global messages
    swal({
      title: "Sucess!",
      text: message,
      icon: "success",
      button: "Continue!"
    });
  }

  render() {
    return (
      <div className={this.state.component}>
        <h1>Plexxis Employees</h1>
        <NightModeSwitch
          triggerThemeSwap={this.triggerThemeSwap}
          theme={this.state.theme}
        />
        <EmployeesTable globalAlerts={this.globalAlerts} apiURL={apiURL} />
      </div>
    );
  }
}

export default App;
