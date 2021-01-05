import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      <div className="py-2 mb-5 border-bottom">
        <h2>
          <Link to="/">Saiga Reader</Link>
        </h2>
      </div>
    </div>
  );
};

export default Header;
