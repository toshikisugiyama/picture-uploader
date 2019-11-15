import React from 'react';

const RegisterForm = (
  {
    registerEmail,
    changeRegisterEmail,
    registerUserName,
    changeRegisterUserName,
    registerPassword,
    changeRegisterPassword,
    registerPasswordConfirmation,
    changeRegisterPasswordConfirmation,
    handleFormSubmit
  }) => {
  return(
    <div>
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form-contents">
          <div className="form-items">
            <label htmlFor="username">Name</label>
            <input
              type="text"
              className="form-item"
              id="username"
              name="registerUserName"
              autoComplete="username"
              onChange={changeRegisterUserName}
              value={registerUserName}
            />
          </div>
          <div className="form-items">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="form-item"
              id="email"
              name="registerEmail"
              autoComplete="email"
              onChange={changeRegisterEmail}
              value={registerEmail}
            />
          </div>
          <div className="form-items">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-item"
              id="password"
              name="registerPassword"
              autoComplete="new-password"
              onChange={changeRegisterPassword}
              value={registerPassword}
            />
          </div>
          <div className="form-items">
            <label htmlFor="password-confirmation">Password (confirm)</label>
            <input
              type="password"
              className="form-item"
              id="password-confirmation"
              name="registerPasswordConfirmation"
              autoComplete="new-password"
              onChange={changeRegisterPasswordConfirmation}
              value={registerPasswordConfirmation}
            />
          </div>
        </div>
        <div className="form-button">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
