import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginForm from "./containers/login/index";
import MenuMainRecepcion from "./containers/recepcion/main/index";
import './App.css';
import MenuMainDermatologos from './containers/dermatologos/main';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Route
          exact path="/"
          component={LoginForm} />
        <Route
          exact path="/recepcion"
          component={MenuMainRecepcion} />
        <Route
          exact path="/dermatologos"
          component={MenuMainDermatologos} />
      </div>
    </Router>
  );
}

export default App;
