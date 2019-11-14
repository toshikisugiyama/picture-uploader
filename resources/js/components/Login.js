import React from 'react';

const Login = props => {
  return(
    <div>
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
      <span>
        {props.tab}
      </span>
    </div>
  );
};
export default Login;
