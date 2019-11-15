import React from 'react';

const LoginForm = (
  {
    loginEmail,
    changeLoginEmail,
    loginPassword,
    changeLoginPassword,
    handleFormSubmit
  }) => {
  return(
    <div>
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form-contents">
          <div className="form-items">
            <label htmlFor="login-email">Email</label>
            <input
              type="text"
              className="form-item"
              id="login-email"
              name="loginEmail"
              onChange={changeLoginEmail}
              value={loginEmail}
            />
          </div>
          <div className="form-items">
            <label htmlFor="login-password">Password</label>
            <input
              type="text"
              className="form-item"
              id="login-password"
              name="loginPassword"
              onChange={changeLoginPassword}
              value={loginPassword}
            />
          </div>
        </div>
        <div className="form-button">
          <button type="submit">login</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
