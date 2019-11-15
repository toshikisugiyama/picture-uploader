import React from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = (
  {
    tab,
    handleLogin,
    handleRegister,
    loginEmail,
    changeLoginEmail,
    loginPassword,
    changeLoginPassword,
    registerEmail,
    changeRegisterEmail,
    registerPassword,
    changeRegisterPassword,
    handleFormSubmit
  }) => {
  return(
    <div className="login">
      <ul className="tab">
        <li
          className={`tab-item ${(tab===0)?'active':''}`}
          onClick={handleLogin}
        >
          Login
        </li>
        <li
          className={`tab-item ${(tab===1)?'active':''}`}
          onClick={handleRegister}
        >
          Register
        </li>
      </ul>
      {
        (tab===0)?
          <LoginForm
            loginEmail={loginEmail}
            changeLoginEmail={changeLoginEmail}
            loginPassword={loginPassword}
            changeLoginPassword={changeLoginPassword}
            handleFormSubmit={handleFormSubmit}
          />
        :
          <RegisterForm
            registerEmail={registerEmail}
            changeRegisterEmail={changeRegisterEmail}
            registerPassword={registerPassword}
            changeRegisterPassword={changeRegisterPassword}
            handleFormSubmit={handleFormSubmit}
          />
      }
    </div>
  );
};
export default Login;
