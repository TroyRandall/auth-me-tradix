import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Redirect , useLocation} from 'react-router-dom';
import './LandingPageNav.css';

const LandingPageNav = () => {
const currentuser = useSelector(state => state.session.user);
const location = useLocation();
const current_url = location.pathname;


if (currentuser) {
    return <Redirect to='/' />;
}

if (current_url === "/") document.querySelector('meta[name="theme-color"]').setAttribute('content', `#002615`);
return (
    <div className="landing-page-container">
            <div className={`landing-page ${current_url === "/" ? "landing-page-green" : "landing-page-white"}`}>
                <NavLink exact to="/">
                    <div className="landing-page-logo">
                        <p className="landing-page-logo-text">Tradix</p>
                        <i className="fa-solid fa-rocket"></i>
                    </div>
                </NavLink>
                <div className="landing-page-navlink-actions-container">
                    <ul className="landing-page-navlinks">
                        <NavLink to="/offer">
                            <li className="landing-page-navlink" id="landing-page-Invest-button">What We Offer </li>
                        </NavLink>
                        <NavLink to="/learn">
                            <li className="landing-page-navlink" id="landing-page-learn-button">Learn</li>
                        </NavLink>
                        <NavLink to="/snack">
                            <li className="landing-page-navlink" id="landing-page-CashCard-button">Snacks</li>
                        </NavLink>
                        <a className="landing-page-navlink" href="" target="_blank" rel="noopener noreferrer">Support</a>
                    </ul>
                    <div className="landing-page-actions">
                        <NavLink to="/login" exact>
                            <button id="landing-page-login">
                                Log in
                            </button>
                        </NavLink>
                        <NavLink to="/signup" exact>
                            <button id="landing-page-signup">
                                Sign up
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div >
     </div>
    );
};



export default LandingPageNav;
