import React from 'react';

const RegisterForm = () => {
  return(
    <div>
      <form className="form">
        <div className="form-contents">
          <div className="form-items">
            <label for="login-email">Email</label>
            <input type="text" className="form-item" id="login-email" />
          </div>
          <div className="form-items">
            <label for="login-password">Password</label>
            <input type="text" className="form-item" id="login-password" />
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
