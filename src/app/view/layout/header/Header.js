import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../../../src/logo-01.png';
import './Header.scss';

export default function Header (props){
    return (
      <React.Fragment>
        <div className="header">
          <div className="logo">
            <Link to="/"><img width={120} height={40} src={logo} alt="itea-scan" /> </Link>
          </div>
        </div>
      </React.Fragment >
    );
}