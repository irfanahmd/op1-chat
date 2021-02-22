import "./App.css";
import { Route, Switch } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Landing from "../../pages/Landing/Landing";
import Operator from "../../pages/Operator/Operator";

function App() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Landing}></Route>
        <Route exact path="/roomId:" component={Operator}></Route>
      </Switch>
      <Operator />
    </div>
  );
}

export default App;
