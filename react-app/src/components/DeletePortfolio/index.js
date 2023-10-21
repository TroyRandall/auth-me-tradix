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

  useEffect(() => {
    console.log(stockInfo);
    if (Object.values(stockInfo).length > 1 && userId) {
      let formatted = [];
      Object.values(portfolios).forEach((portfolio) => {
        if (!portfolio?.sold_at) {
          formatted.push({
            name: portfolio?.name,
            quantity: portfolio?.quantity,
          });
        }
      });
      let count = 0;
      formatted.forEach((ticker) => {
        count =
          count +
          Object.values(
            stockInfo[ticker?.name]["Time Series (Daily)"]
          ).reverse()[0]["4. close"] *
            ticker?.quantity;
      });
      setValue(count);
    }
  }, [stockInfo,]);

  if (!currentUser) history.push("/login");

  const cancelModal = (e) => {
    const overlay = document.getElementById("overlay");
    const yesButton = document.getElementById("confirm-portfolio-reset");
    const noButton = document.getElementById("deny-portfolio-reset");
    if (e.target === overlay || e.target === noButton) {
      setToggle(false);
      setErrors(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!portfolios?.length) {
      setErrors({
        ...errors,
        size: "You Have No Stocks To Sell, Your Portfolio Is Brand New",
      });
      return null;
    }
    const response = dispatch(
      portfolioActions.deletePortfolioItem(userId, value)
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
          <div id="delete-portfolio">
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
            <h3 className="delete-portfolio-items" id="delete-form-title">
              !!!ATTENTION!!!{" "}
            </h3>
            <h3 className="delete-portfolio-items">
              You Are About To Delete Your Portfolio
            </h3>
            <p
              className="delete-portfolio-items"
              id="delete-portfolio-paragraph"
            >
              Doing So Will Liquidate All of Your Assets and Erase All History
              Of Your Account.
            </p>
            <p className="delete-portfolio-items" id="delete-confirm">
              Would You Like To Continue?
            </p>
            <div className="delete-portfolio-items">
              <button
                className="delete-portfolio-items"
                id="confirm-portfolio-reset"
                onClick={handleDelete}
              >
                Yes
              </button>{" "}
              <button
                className="delete-portfolio-items"
                onClick={cancelModal}
                id="deny-portfolio-reset"
              >
                No
              </button>
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
