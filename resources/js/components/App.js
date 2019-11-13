import React from 'react';
import PhotoList from '../components/PhotoList';
import Login from '../components/Login';
import {BrowserRouter as Router,Switch,Route,} from 'react-router-dom';

const App = () => {
  return(
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <PhotoList />
        </Route>
      </Switch>
    </Router>
  );
};
export default App;
