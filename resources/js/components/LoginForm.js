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
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-item"
              id="email"
              name="loginEmail"
              autoComplete="email"
              onChange={changeLoginEmail}
              value={loginEmail}
            />
          </div>
          <div className="form-items">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-item"
              id="password"
              name="loginPassword"
              autoComplete="current-password"
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
