import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StockList from "../StockList/StockList";
import Modal from "../Modal/Modal";
import * as portfolioActions from "../../store/portfolio";
import "./stockPurchaseForm.css";

function PurchaseStockForm({ average, isLoaded, change }) {
  const { ticker } = useParams();

  const { stockId } = useParams();

  const [show, setShow] = useState(false);

  const uppercaseTicker = ticker.toUpperCase();
  const dispatch = useDispatch();
  const submitRef = useRef();
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [backendToggle, setBackendToggle] = useState(false);
  const[modalToggle, setModalToggle] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState('');
  const [estimate, setEstimate] = useState("");
  const [submitToggle, setSubmitToggle] = useState(false);
  const [backendErrors, setBackendErrors] = useState(false);
  const [errors, setErrors] = useState({});
  const currentUser = useSelector((state) => state.session.user);
  const stockInfo = useSelector((state) => state.stocks)

  useEffect(() => {
    setEstimate((avgPrice * quantity).toFixed(2));

    if (submitToggle) {
      let newErrors = {};

      if (currentUser === null)
        newErrors.user = "You Must Be Logged In To Purchase Stock";
      if (currentUser !== null) {
        if (currentUser?.buyingPower < estimate)
          newErrors.buyingPower = "You Do Not Have Enough Buying Power";
        if (quantity <= 0) newErrors.quantity = "Quantity is Required";
        if (tickerSymbol === "") newErrors.ticker = "Ticker Symbol is required";
        if (tickerSymbol !== ticker && !newErrors.ticker)
          newErrors.ticker =
            "Ticker Symbol Must Be The Symbol Assosicated With This Stock";
        if (avgPrice <= 0) newErrors.price = "Price is Required";
        if (avgPrice < average && !newErrors.price)
          newErrors.price =
            "Orders with a Price below the Average Stock Price Will Not Be Filled";
      }

      setErrors({ ...newErrors });
      if (errors.length > 0 || Object.values(newErrors).length > 0) return errors;
      else setBackendToggle(true)
    }


    const closeModal = (e) => {
      setSubmitToggle(false);
      setModalToggle(false);
      setBackendToggle(false);
      setAvgPrice('');
      setQuantity('');
      setTickerSymbol('')

    };

    if (modalToggle) {
      document.addEventListener("click", closeModal);

      return () => document.removeEventListener("click", closeModal);
    }
  }, [avgPrice, quantity, submitToggle, modalToggle]);

  const handleSubmit =  (e) => {
    const submitButton = document.getElementById('form-submit-button')
    const submitButtonMinus = document.getElementById('form-submission-button-minus')
    setSubmitToggle(true);
    if(backendToggle && (submitRef.current.contains(e.target))) {
        let id = currentUser?.id;
    let portfolio = { id, tickerSymbol, quantity, avgPrice };
    if (!Object.values(errors).length) {
      const response =  dispatch(
        portfolioActions.addPortfolioItem(portfolio)
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setBackendErrors(data.errors);
      });
      setModalToggle(true)
      return response;
    }

    }
    else return null;
  };

  const UlClassName = "overlay" + (modalToggle ? "" : "hidden");

  const checkModal = () => {
    if (modalToggle) {
      return (
        <div >
          {Object.values(backendErrors).length ? (
            <div id="failed-purchase">
              <h3 id="purchase-title"> Order Not Executed</h3>
              <p>
                {Object.values(backendErrors)?.map((error) => {
                  return <p id="purchase-message-failed"> {error} </p>;
                })}
              </p>
            </div>
          ) : (
            <div id="successful-purchase">
              <h3 id="purchase-title">Congratulations ! </h3>
              <p id="purchase-message-success">
                Your Market Order for {quantity} Shares of {tickerSymbol} for $
                {avgPrice} Is Completed
              </p>
            </div>
          )}
        </div>
      );
    }
  };
  return (
    isLoaded && (
      <>
        <div className="form-con">
          <form
            id={
              Object.values(errors).length > 0
                ? "purchase-form"
                : "purchase-form"
            }
          >
            <h5 id="form-title">Buy {uppercaseTicker}</h5>
            {
              <p id="errors-errors" className='purchase-form-item'>
                {Object.values(errors).map((error) => (
                  <li id='error-item'>{error}</li>
                ))}
              </p>
            }
            <div className="purchase-form-item">
              <p id="form-field1" className="stock-purchase-item">
                Order Type
              </p>{" "}
              <p className="stock-purchase-item" id="form-field2">
                Buy Order
              </p>
            </div>
            <div className="purchase-form-item">
              <label id="form-ticker-label" className="stock-purchase-item">
                Stock Ticker
              </label>
              <input
                className="stock-purchase-item"
                id="form-ticker-input"
                name="symbol"
                placeholder="Ticker Symbol"
                value={tickerSymbol}
                onChange={(e) => setTickerSymbol(e.target.value)}
                required
              ></input>
            </div>
            <div className="purchase-form-item">
              <label className="stock-purchase-item" id="form-quantity-label">
                Quantity
              </label>
              <input
                id="form-quantity-input"
                name="quantity"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              ></input>
            </div>
            <div className="purchase-form-item">
              <label id="form-price-label">Average Price</label>
              <input
                id="form-price-input"
                name="Average price"
                placeholder={average}
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                required
              ></input>
            </div>
            <div className="purchase-form-item">
              <label id="form-purchaseIn-label">Purchase In</label>
              <select name="purchaseIn" id="form-purchaseIn-input">
                <option value="shares">Shares</option>
                <option value="shares">Dollars</option>
                <option value="shares">Cryptos</option>
              </select>
            </div>
            <div
              ref={submitRef}
              onClick={handleSubmit}
              id={
                change === "+"
                  ? "form-submit-button"
                  : "form-submit-button-minus"
              } className='purchase-form-item'
            >
              <span>Add to portfolio</span>
            </div>{" "}
            <div className="buying-purchase-form-item">
              <label id="form-estimated-price">
                {" "}
                {estimate > 0
                  ? `Estimated Price is $${estimate.toLocaleString("en-US")}`
                  : ""}
              </label>

              <p id="form-buying-power-available">
                Buying Power Available $
                {currentUser?.buyingPower ? currentUser?.buyingPower : 0}
              </p>
            </div>
            <div id="modal-form">
              <div>{checkModal()}</div>
            </div>
            <button onClick={() => setShow(true)} className="addTolist">
              <span>Add to Watchlist</span>
            </button>
            <Modal
              title={`Add ${ticker} to a Watchlist ?`}
              show={show}
              onClose={() => setShow(false)}
            >
              <>
                <StockList assetID={stockId} assetSymbol={ticker} />
              </>
            </Modal>
            {/* <button
            className={
              change === "+"
                ? "form-add-to-watchlist"
                : "form-add-to-watchlist-minus"
            }
          >
            Add To watchlist
          </button> */}
          </form>
        </div>
      </>
    )
  );
}
export default PurchaseStockForm;
