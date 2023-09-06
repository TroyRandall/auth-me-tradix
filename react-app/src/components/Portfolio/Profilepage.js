import AppMainNavBar from "../MainUserNav/MainUserNav";
// import ProfileSection from "./ProfileSection";
// import LikedNews from "./News/LikedNews";
import './Profilepage.css'
import WatchlistTab from "../Watchlist/WatchlistTab";
import UserAssets from "./UserAsset";

function ProfilePage() {
    return (
        <div className="profile-page-container">
            <AppMainNavBar />
            <div className="profile-page-center-util">
                <div className="profile-page">
                    <div className="app-home-left">
                        {/* <ProfileSection /> */}
                        <div className="profile-page-profile-info">
                            <div className="profile-page-profile-info-container" id="profile-page-assets">
                                <h2 className="profile-page-profile-info-title">Assets</h2>
                                <div>
                                    <UserAssets />
                                </div>
                            </div>

                            <div className="profile-page-profile-info-container" id="profile-page-watchlists">
                                <h2 className="profile-page-profile-info-title">Watchlists</h2>
                                <div className="profile-page-profile-info-watchlist-main ">
                                    <WatchlistTab />
                                </div>
                            </div>

                            <div className="profile-page-profile-info-container" id="profile-page-bookmarks">
                                <h2 className="profile-page-profile-info-title">Bookmarks</h2>
                                <div>
                                    {/* <LikedNews /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="app-home-right" />
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
