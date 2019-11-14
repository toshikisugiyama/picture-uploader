import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
  return(
    <nav>
      <Link to="/">Picture Uploader</Link>
      <div className="navbar-menu">
        <div className="navbar-item">
          <button>
            submit photo
          </button>
        </div>
        <span className="navbar-item">
          username
        </span>
        <div className="navbar-item">
          <Link to="/login">
            Login / Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
