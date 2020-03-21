import React from 'react';
import './App.css';
import Home from "./Home";
import {Switch,Route} from "react-router-dom";
import Default from "./Default"
import Bisection from './RootOfEqualtion/Bisection';
import FalsePosition from "./RootOfEqualtion/FalsePosition"
import NewtonRhop from "./RootOfEqualtion/NewtonRhop"
import OnePoint from "./RootOfEqualtion/Onepoint"
import Secant from "./RootOfEqualtion/Secant"
import Add from "./adddata"
import adddata from './adddata';

function App() {

  return (
    <div className="App">
      <React.Fragment>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/Add" component={adddata}/>
        <Route exact path="/Bisection" component={Bisection}/>
        <Route exact path="/FalsePosition" component={FalsePosition}/>
        <Route exact path="/NewtonRhop" component={NewtonRhop}/>
        <Route exact path="/OnePoint" component={OnePoint}/>
        <Route exact path="/Secant" component={Secant}/>
        <Route component={Default}/>
      </Switch>
      </React.Fragment>
      
    </div>
  );
}

export default App;
