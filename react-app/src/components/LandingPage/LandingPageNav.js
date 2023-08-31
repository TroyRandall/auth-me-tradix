import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import './LandingPageNav.css';

const LandingPageNav = () => {
const currentuser = useSelector(state => state.session.user);

if(currentuser) {
    return <Redirect to='/'/>
}
return (
    <div></div>
)
}
