import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import PhotoList from '../components/PhotoList';
import Login from '../components/Login';
import Footer from '../components/Footer';
import {BrowserRouter as Router,Switch,Route,} from 'react-router-dom';

const App = () => {
  const [tab, setTab] = useState(0);
  const handleLogin = () => {
    setTab(0);
  };
  const handleRegister = () => {
    setTab(1);
  };
  return(
    <Router>
      <Navbar />
      <Switch>
        <Route path="/login">
          <Login
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            tab={tab}
          />
        </Route>
        <Route path="/">
          <PhotoList />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};
export default App;
