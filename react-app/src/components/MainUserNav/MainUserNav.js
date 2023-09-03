import { useEffect, useState, useCallback } from 'react';
import React from 'react';
import Search from '../Search';

import './MainUserNav.css'
import { Link } from 'react-router-dom';
import AccountButton from './AccountButton';

const AppMainNavBar = () => {
    const [color, setColor] = useState('#5ac53b');

    return (
        <div id="app-nav-bar">
            <Link to="/app"> <i className='fa-solid fa-rocket'  id="app-nav-bar-logo" /></Link>
            <Search />
             <AccountButton />
        </div>
    );
};

export default AppMainNavBar
