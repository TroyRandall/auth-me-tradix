import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./deletePortfolio.css";
import { authenticate } from "../../store/session";

import * as portfolioActions from "../../store/portfolio";
import "./deletePortfolio.css";

function DeletePortfolioForm({ price, reset, setStocksIsLoaded }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userId } = useParams();
  const currentUser = useSelector((state) => state.session.user);
  const portfolios = useSelector((state) => state.portfolios[userId]);
  const stockInfo = useSelector((state) => state.stocks);
  const [value, setValue] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [errors, setErrors] = useState(false);

  if (!currentUser) history.push("/login");

  const cancelModal = (e) => {
    const overlay = document.getElementById("overlay");
    const noButton = document.getElementById("deny-portfolio-reset");
    if (e.target === overlay || e.target === noButton) {
      setToggle(false);
      setErrors(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (price === 0) {
      setErrors({
        ...errors,
        size: "You Have No Stocks To Sell, Please Purchase Some Stocks To Perform This Action",
      });
      return null;
    }
    const response = dispatch(
      portfolioActions.deletePortfolioItem(userId, price)
    ).then(async (res) => {
      const data = res;

      if (data && data.errors) {
        setErrors(data.errors);
        return null;
      }
    });
    dispatch(authenticate());
    setToggle(false);
    return response;
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
          <div class="delete-portfolio-card">
            <div>
              {Object.values(errors).map((error) => {
                return (
                  <li
                    className="delete-portfolio-items"
                    id="errors-errors-delete"
                  >
                    {error}
                  </li>
                );
              })}
            </div>
            <div class="delete-portfolio-card__warning">
              <div className='delete-portfolio-card__warning-red'>
              Warning
              </div>
              <div class="delete-portfolio-card__warning-text">
                Deleting your entire portfolio is irreversible. Are you
                sure you want to proceed?
              </div>
            </div>
            <div class="delete-portfolio-card__buttons">
              <div
                class="delete-portfolio-card__button delete-portfolio-card__button--yes"
                onClick={handleDelete}
                id="confirm-portfolio-reset"
              >
                Yes
              </div>
              <div
                class="delete-portfolio-card__button delete-portfolio-card__button--no"
                onClick={cancelModal}
                id="deny-portfolio-reset"
              >
                No
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div id="reset-portfolio">
      <button id="reset-button" onClick={changeToggle}>
        <span class="shadow"></span>
        <span class="edge"></span>
        <span class="front text">Reset Portfolio</span>
      </button>
      <div>{checkModal()}</div>
    </div>
  );
}

export default DeletePortfolioForm;
