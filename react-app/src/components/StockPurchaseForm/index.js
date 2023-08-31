import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import "./stockPurchaseForm.css";

function PurchaseStockForm({ average, isLoaded, change }) {
  const { ticker } = useParams();
  const uppercaseTicker = ticker.toUpperCase();
  const dispatch = useDispatch();
  const [tickerSymbol, setTickerSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const currentUser = useSelector((state) => state.session);

  return (
    isLoaded && (
      <>
        <form id="purchase-form">
          <h5 id="form-title">Buy {uppercaseTicker}</h5>
          <p id="form-field1">Order Type</p> <p id="form-field2">Buy Order</p>
          <label id="form-ticker-label">Stock Ticker</label>
          <input
            id="form-ticker-input"
            name="symbol"
            placeholder="Ticker Symbol"
            value={tickerSymbol}
            onchange={(e) => setTickerSymbol(e.target.value)}
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
          <label for="purchaseIn" id="form-purchaseIn-label">
            Purchase In
          </label>
          <select name="purchaseIn" id="form-purchaseIn-input">
            $<option value="shares">Shares</option>
            <option value="dollars">Dollars</option>
          </select>
          <button
            type="Submit"
            id={
              change === "+" ? "form-submit-button" : "form-submit-button-minus"
            }
          >
            Add To Portfolio
          </button>
          <p id='form-buying-power-available'>${currentUser?.buying_power ? currentUser?.buying_power : 0} Buying Power Available</p>
        </form>
      </>
    )
  );
}
export default PurchaseStockForm;
