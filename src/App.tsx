import React from "react";
import "./App.css";
import { HomePage, Box, DeviceInfoPage, LoginPage } from "./components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="SmartHome">
        <Box paddings={["pt64", "pb64", "pl16", "pr16"]}>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/device">
              <DeviceInfoPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Box>
      </div>
    </Router>
  );
}

export default App;
