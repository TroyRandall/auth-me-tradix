import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import "./css/global.css";
import "./css/resets.css";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
// import Navigation from "./components/Navigation";
import CashCard from "./components/LandingPage/SupportCashCard";
import OfferLanding from "./components/LandingPage/Offer";
import StockDetails from './components/StockDetails'
import LandingHomePage from "./components/LandingPage/LandingHomePage";
import LandingHomeFooter from "./components/LandingPage/LandingHomeFooter";
import LandingPageNav from "./components/LandingPage/LandingPageNav";
import LearnHomePage from "./components/LandingPage/Learn";
import AppHome from "./components/HomePageUser/AppHome";
import AppMainNavBar from "./components/MainUserNav/MainUserNav";
import PortfolioPage from "./components/Portfolio";
import ProfilePage from "./components/Portfolio/Profilepage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import Testing from './components/Portfolio/Testing'
import DarkMode from "./components/DarkMode/DarkMode";
import StockNav from "./components/MainUserNav/StockNav";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {/* <Navigation isLoaded={isLoaded} />
      {isLoaded && ( */}
      <Switch>
        <Route path="/" exact={true}>
          <LandingPageNav />
          <LandingHomePage />
        </Route>
        <Route path="/learn">
          <LandingPageNav />
          <LearnHomePage />
        </Route>
        <Route path='/offer' >
        <LandingPageNav />
        <OfferLanding />
        <LandingHomeFooter />
        </Route>
        <Route path="/login" exact={true}>
          <LoginFormPage />
          <LandingHomeFooter />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignupFormPage />
          <LandingHomeFooter />
        </Route>
        {/* <Route path="/app" exact={true}>
          <AppHome />
        </Route> */}

        <Route path='/testing'>
          <Testing></Testing>
        </Route>
        <Route path="/stocks/:ticker">
          {/* <DarkMode /> */}
          <StockNav />
          <StockDetails />
        </Route>
        <Route path="/portfolios/:userId">
          <AppHome />
          <LandingHomeFooter />
        </Route>
        <Route path='/support'>
          <LandingPageNav />
          <CashCard />
          <LandingHomeFooter />
        </Route>
          <Route path="/login" exact={true} >
            <LoginFormPage />
            <LandingHomeFooter />
          </Route>
          <Route path="/sign-up" exact={true}>
            <SignupFormPage />

          </Route>
          <ProtectedRoute path="/profile" exact>
            <ProfilePage />
        </ProtectedRoute>


        </Switch>

      {/* )} */}
    </>
  );
}

export default App;
