import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Landing from "../../pages/Landing/Landing";
import Operator from "../../pages/Operator/Operator";

function App() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/:roomId" component={Operator} />
      </Switch>
    </div>
  );
}

export default App;
