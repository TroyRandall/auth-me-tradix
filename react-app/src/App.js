import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import './css/global.css'
import './css/resets.css'
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
// import Navigation from "./components/Navigation";

import StockDetails from './components/StockDetails'
import LandingHomePage from "./components/LandingPage/LandingHomePage";
import LandingHomeFooter from "./components/LandingPage/LandingHomeFooter";
import LandingPageNav from "./components/LandingPage/LandingPageNav";
import LearnHomePage from "./components/LandingPage/Learn";
import AppHome from "./components/HomePageUser/AppHome";

import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
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
          <Route path='/' exact={true}>
            <LandingPageNav />
            <LandingHomePage />
          </Route>
          <Route path="/learn">
            <LandingPageNav />
            <LearnHomePage />
            <LandingHomeFooter/>
        </Route>
          <Route path="/login" exact={true} >
            <LoginFormPage />
          </Route>
          <Route path="/sign-up" exact={true}>
            <SignupFormPage />
          </Route>
          <Route path='/app' exact={true}>
            <AppHome />
          </Route>
          <Route path='/stocks/:ticker'>
            <StockDetails />
          </Route>

        </Switch>
      {/* )} */}

    </>
  );
}

export default App;
