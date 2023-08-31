import React from 'react'
import './LandingHomeFooter.css'

const LandingHomeFooter = () => {
    return (
        <div id="footer-container">
            <div id="footer-top-container">
                <div id="footer-top-left-container">
                    <div id="footer-top-left-content">
                        <div id="top-footer-text">Hosted by Render</div>

                    </div>
                </div>
                <div id="footer-top-right-container">
                    <div id="footer-top-right-content">
                        <div id="top-footer-text">Made with Python, Flask, JavaScript, Npm, React, HTML, CSS, SQL, Aws</div>
                    </div>
                </div>

            </div>
            <div id="footer-bottom-container">
                <div id="footer-bottom-left">
                    <div id="footer-bottom-left-content">
                        <div className="names" id="name-container">
                            Troy Randall
                            <a href="https://github.com/TroyRandall">
                                Github
                            </a>
                            <a href="">
                                LinkedIn
                            </a>
                        </div>
                        <div className="names" id="name-container">
                            Vi Truong
                            <a href="https://github.com/vivitruong">
                                Github
                            </a>
                            <a href="https://www.linkedin.com/in/vi-truong-421698253/">
                                LinkedIn
                            </a>

                        </div>

                    </div>
                </div>
                <div id="footer-bottom-right">
                    <div id="footer-bottom-right-content">
                        <div id="text-disclaimer">
                            <div id="disclaimer">
                                All investing involves risk, except for Tradix. No deposit needed. Any money in Tradix is virtual money.
                            </div>
                            <div id="disclaimer">
                             Adventures in Financial Rollercoasterism: The Hilarious Handbook to Risky Stock Trading! 🎢📈🤣
                            </div>
                            <div id="disclaimer">
                                © 2023 Tradix. All rights reserved.

                            </div>



                        </div>
                    </div>
                </div>


            </div>

        </div>
    )

}

export default LandingHomeFooter;
