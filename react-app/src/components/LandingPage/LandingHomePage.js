import React from "react";
import "./LandingHomePage.css";
import LandingHomeFooter from "./LandingHomeFooter";

const LandingHomePage = () => {
    return (
        <div id='home-whole-container'>
            <div id="home-video-section">
                <div id="video-container">
                    <video className="video" controlsList="nodownload nofullscreen noremoteplayback" muted autoPlay playsInline src="https://tradix.s3.us-east-2.amazonaws.com/landingvideo.mp4" />

                </div>
                <div id="under-video-container">
                    <div id="under-video-text">
                        <div id="top-line">
                           Break through to the new 4.9% APY
                        </div>
                        <div id="bottom-line">
                        Tomorrow starts today with our highest rate ever on uninvested cash, FDIC-insured up to $2M at partner banks.* First 30 days free, then just $5/month.
                        </div>
                    </div>
                    <div id="button-container">

                            <button id="home-page-learn-more">Learn More</button>
                    </div>
                </div>
            </div>
            <LandingHomeFooter />
        </div >
    );
};

export default LandingHomePage;
