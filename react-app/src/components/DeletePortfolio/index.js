import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { authenticate } from "../../store/session";

import * as portfolioActions from "../../store/portfolio";
import './deletePortfolio.css'

function DeletePortfolioForm({ price, setStocksIsLoaded }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const currentUser = useSelector((state) => state.session.user);
  const portfolios = useSelector((state) => state.portfolios[userId]);
  const stockInfo = useSelector((state) => state.stocks)
  const [value, setValue] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [errors, setErrors] = useState({});

  if (!currentUser) history.push("/login");


  const cancelModal = async (e) => {
    e.preventDefault()
    console.log(e.target)
    const overlay = document.getElementById("overlay");
    const yesButton = document.getElementById("confirm-portfolio-reset");
    const noButton = document.getElementById("deny-portfolio-reset");
    if (e.target === overlay || e.target === noButton) setToggle(false);
    else if (e.target === yesButton) {
      if (!errors.length) {
        const response = await dispatch(
          portfolioActions.deletePortfolioItem(userId, price)
        ).catch(async (res) => {
          const data = res;
          if (data && data.errors) setErrors(data.errors);
        });
        if (!Object.values(errors).length) {
          setToggle(false);
        }
        await dispatch(portfolioActions.getPortfoliosByUser(userId+1));
        await dispatch(portfolioActions.getPortfoliosByUser(userId));
        await dispatch(authenticate())
        return response;
      } else {
        setToggle(false);
      }
    }
  };

  const changeToggle = (e) => {
    e.preventDefault();
    setToggle(true);
  };

  const UlClassName = "overlay" + (toggle ? "" : "hidden");

  const checkModal = () => {
    if (toggle) {
      return (
        <div className={UlClassName} onClick={cancelModal} id="overlay">
          <div id="delete-portfolio">
            <h3>Are You Sure You Would Like To Reset Your Portfolio?</h3>
            <p>
              Doing So Will Liquidate All of Your Assets and Erase All History
              Of Your Account.
            </p>
            <p>Would You Like To Continue?</p>
            <button id="confirm-portfolio-reset" onClick={cancelModal}>
              Yes
            </button>{" "}
            <button onClick={cancelModal} id="deny-portfolio-reset">
              No
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <button onClick={changeToggle}>Reset Portfolio</button>
      <div>{checkModal()}</div>
    </div>
  );
}

export default DeletePortfolioForm
