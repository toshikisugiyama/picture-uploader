import React from 'react';

const RegisterForm = (
  {
    registerEmail,
    changeRegisterEmail,
    registerPassword,
    changeRegisterPassword,
    handleFormSubmit
  }) => {
  return(
    <div>
      <form className="form" onSubmit={handleFormSubmit}>
        <div className="form-contents">
          <div className="form-items">
            <label htmlFor="register-email">Email</label>
            <input
              type="text"
              className="form-item"
              id="register-email"
              name="registerEmail"
              onChange={changeRegisterEmail}
              value={registerEmail}
            />
          </div>
          <div className="form-items">
            <label htmlFor="register-password">Password</label>
            <input
              type="text"
              className="form-item"
              id="register-password"
              name="registerPassword"
              onChange={changeRegisterPassword}
              value={registerPassword}
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
