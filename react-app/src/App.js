import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import './css/global.css'
import './css/resets.css'
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import StockDetails from './components/StockDetails'
import LandingHomePage from "./components/LandingPage/LandingHomePage";
import LandingHomeFooter from "./components/LandingPage/LandingHomeFooter";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path='/' exact={true}>
            <LandingHomePage />

          </Route>
          <Route path="/login" exact={true} >
            <LoginFormPage />
          </Route>
          <Route path="/signup" exact={true}>
            <SignupFormPage />
          </Route>
          <Route path='/stocks/:ticker'>
            <StockDetails />
          </Route>

        </Switch>
      )}
    </>
  );
}

export default App;
