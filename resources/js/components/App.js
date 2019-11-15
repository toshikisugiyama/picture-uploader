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
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUserName, setRegisterUserName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirmation, setRegisterPasswordConfirmation] = useState('');
  const changeLoginEmail = e => {
    setLoginEmail(e.target.value);
  }
  const changeLoginPassword = e => {
    setLoginPassword(e.target.value);
  }
  const changeRegisterUserName = e => {
    setRegisterUserName(e.target.value);
  }
  const changeRegisterEmail = e => {
    setRegisterEmail(e.target.value);
  }
  const changeRegisterPassword = e => {
    setRegisterPassword(e.target.value);
  }
  const changeRegisterPasswordConfirmation = e => {
    setRegisterPasswordConfirmation(e.target.value);
  }
  const handleFormSubmit = e => {
    e.preventDefault();
    console.log(loginEmail);
    console.log(loginPassword);
    console.log(registerEmail);
    console.log(registerPassword);
  }

  return(
    <Router>
      <Navbar />
      <Switch>
        <Route path="/login">
          <Login
            tab={tab}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            registerUserName={registerUserName}
            changeRegisterUserName={changeRegisterUserName}
            loginEmail={loginEmail}
            changeLoginEmail={changeLoginEmail}
            loginPassword={loginPassword}
            changeLoginPassword={changeLoginPassword}
            registerEmail={registerEmail}
            changeRegisterEmail={changeRegisterEmail}
            registerPassword={registerPassword}
            changeRegisterPassword={changeRegisterPassword}
            handleFormSubmit={handleFormSubmit}
            registerPassword={registerPassword}
            changeRegisterPassword={changeRegisterPassword}
            registerPasswordConfirmation={registerPasswordConfirmation}
            changeRegisterPasswordConfirmation={changeRegisterPasswordConfirmation}
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
