import React from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = props => {
  const isLogin = props.tab;
  return(
    <div className="login">
      <ul className="tab">
        <li
          className={`tab-item ${(props.tab===0)?'active':''}`}
          onClick={props.handleLogin}
        >
          Login
        </li>
        <li
          className={`tab-item ${(props.tab===1)?'active':''}`}
          onClick={props.handleRegister}
        >
          Register
        </li>
      </ul>
      {
        (props.tab===0)?
          <LoginForm />
        :
          <RegisterForm />
      }
    </div>
  );
};
export default Login;
