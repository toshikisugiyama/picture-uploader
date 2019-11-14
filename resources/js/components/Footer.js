import React from 'react';
import {Link} from 'react-router-dom';

const Footer = () => {
  return(
    <footer>
      <button>
        Logout
      </button>
      <Link to="/login">
        Login / Register
      </Link>
    </footer>
  );
}

export default Footer;
