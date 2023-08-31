import React from 'react';
import './Learn.css';

const LearnHomePage = () => {
    return (
        <div id="learn-page-body">
            <div className="learn-page-top-green-section">
                <div className="learn-page-top-green-section-top">
                    <h1>Investing basics</h1>
                </div>
                <div className="learn-page-top-green-section-bottom">
                    <div className="learn-page-top-green-section-bottom-container">
                        <div className="learn-page-top-green-section-bottom-content">
                            <h2>The building blocks of your financial journey </h2>
                            <p>What you need to know about investing from the get-go.</p>
                        </div>
                        <div className="learn-page-top-green-section-bottom-image">
                            <img src="https://tradix.s3.us-east-2.amazonaws.com/hero-journey.svg" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="learn-page-bottom">
                <div className="learn-page-bottom-container">
                    <div className="learn-page-bottom-investing">
                        <h2 className='invest101'>Investing 101</h2>
                        <p className='invest-explain'>A good place to start. Get the low-down before you dive.</p>

                    </div>
                    <div className="what-is-section-container">
                        <div className="what-is-section">
                            <div className="what-is-section-content">
                                <h3>What is an investment?</h3>
                                <p>An investment is an asset bought with the expectation that it will generate some future income or profit.</p>

                            </div>
                            <img className='learn3' src="https://tradix.s3.us-east-2.amazonaws.com/whatisinvestment.png" />
                        </div>
                        <div className="what-is-section">
                            <div className="what-is-section-content">
                                <h3>What is a</h3>
                                <h3>stock?</h3>
                                <p>A stock is a unit of ownership in a company.</p>

                            </div>
                            <img className='learn3' src="https://tradix.s3.us-east-2.amazonaws.com/whatisstock.png"/>
                        </div>
                        <div className="what-is-section">
                            <div className="what-is-section-content">
                                <h3>What is the stock market?</h3>
                                <p>The stock market is where buyers and sellers come together to trade shares in eligible companies.</p>
                            </div>
                            <img className='learn3' src="https://tradix.s3.us-east-2.amazonaws.com/whatisstockmarket.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};
export default LearnHomePage;
