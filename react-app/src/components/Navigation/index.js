import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LogoutButton from './LogoutButton';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);
		return (
			<nav>
			  <ul>
				<li>
				  <NavLink to='/' exact={true} activeClassName='active'>
					Home
				  </NavLink>
				</li>
				<li>
				  <NavLink to='/login' exact={true} activeClassName='active'>
					Login
				  </NavLink>
				</li>
				<li>
				  <NavLink to='/sign-up' exact={true} activeClassName='active'>
					Sign Up
				  </NavLink>
				</li>
				<li>
				  <NavLink to='/users' exact={true} activeClassName='active'>
					Users
				  </NavLink>
				</li>
				<li>
				  <LogoutButton />
				</li>
			  </ul>
			</nav>
		  );
}

export default Navigation;
