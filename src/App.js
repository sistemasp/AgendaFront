import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import LoginContainer from './containers/LoginContainer';
import LoginForm from "./containers/login/index";
import MenuMain from "./containers/main/index";
import './App.css';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Route
          exact path="/"
          component={LoginForm} />
        <Route
          exact path="/main"
          component={MenuMain} />
      </div>
    </Router>
  );
}

export default App;
