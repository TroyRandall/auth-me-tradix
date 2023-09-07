import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StockList from "../StockList/StockList";
import Modal from "../Modal/Modal";
import * as portfolioActions from "../../store/portfolio";
import "./stockPurchaseForm.css";

function PurchaseStockForm({ average, isLoaded, change }) {
  const { ticker } = useParams();
  console.log(ticker)
  const {stockId} = useParams();
  console.log(stockId)
  const [show, setShow] = useState(false);

  const uppercaseTicker = ticker.toUpperCase();
  const dispatch = useDispatch();
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [estimate, setEstimate] = useState("");
  const [submitToggle, setSubmitToggle] = useState(false);
  const [backendToggle, setBackendToggle] = useState(false);
  const [errors, setErrors] = useState({});
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    setEstimate((avgPrice * quantity).toFixed(2));

    if (submitToggle) {
      let newErrors = {};

      if (currentUser === null) newErrors.user = "You Must Be Logged In To Purchase Stock";
      if(currentUser !== null) {
           if (currentUser?.buying_power < estimate) newErrors.buying_power = "You Do Not Have Enough Buying Power";
        if(quantity <= 0) newErrors.quantity = "Quantity is Required"
        if(tickerSymbol === '') newErrors.ticker = "Ticker Symbol is required"
        if(avgPrice <= 0) newErrors.price = "Price is Required"
      }


      setErrors({ ...newErrors });
      if (errors && Object.values(newErrors).length > 0) return errors;
      else {
        setBackendToggle(true);
      }
    }
  }, [avgPrice, quantity, submitToggle]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitToggle(true)
    let id = currentUser?.id;
    let portfolio = { id, tickerSymbol, quantity, avgPrice };
    if (backendToggle) {
    }
  };
  return (
    isLoaded && (
      <>
        <form id={Object.values(errors).length > 0 ? 'purchase-form-errors' : 'purchase-form'}>
          <h5 id="form-title">Buy {uppercaseTicker}</h5>
          {<p id='errors-errors'>{Object.values(errors).map(error => <li>{error}</li>)}</p>}
          <p id="form-field1">Order Type</p> <p id="form-field2">Buy Order</p>
          <label id="form-ticker-label">Stock Ticker</label>
          <input
            id="form-ticker-input"
            name="symbol"
            placeholder="Ticker Symbol"
            value={tickerSymbol}
            onChange={(e) => setTickerSymbol(e.target.value)}
            required
          ></input>
          <label id="form-quantity-label">Quantity</label>
          <input
            id="form-quantity-input"
            name="quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          ></input>
          <label id="form-price-label">Average Price</label>
          <input
            id="form-price-input"
            name="Average price"
            placeholder={average}
            value={avgPrice}
            onChange={(e) => setAvgPrice(e.target.value)}
            required
            default={average}
          ></input>
          <label id="form-purchaseIn-label">Purchase In</label>
          <select name="purchaseIn" id="form-purchaseIn-input">
            <option value="shares">Shares</option>
          </select>
          <label id="form-estimated-price">
            {" "}
            {estimate > 0
              ? `Estimated Price is $${estimate.toLocaleString("en-US")}`
              : ""}
          </label>
          <div
            onClick={handleSubmit}
            id={
              change === "+" ? "form-submit-button" : "form-submit-button-minus"
            }
          >
            Add To Portfolio
          </div>
          <p id="form-buying-power-available">
            Buying Power Available $
            {currentUser?.buying_power ? currentUser?.buying_power : 0}
          </p>
          <button onClick={() => setShow(true)} className="addTolist">
							Add to Watchlist
						</button>
          <Modal
							title={`Add ${ticker["symbol"]} to a Watchlist`}
							show={show}
							onClose={() => setShow(false)}
						>
							<>
								<StockList assetID={stockId} assetSymbol={ticker["symbol"]} />
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
      </>
    )
  );
}
export default PurchaseStockForm;
