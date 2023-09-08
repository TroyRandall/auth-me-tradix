import { useState, useEffect } from "react";
import { useDispatch, useSelector,  } from "react-redux";
import { useHistory } from "react-router-dom";

import * as portfolioActions from "../../store/portfolio";
import './StockSellForm.css'

function SellStockForm({ portfolio }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.session.user);
  const stockInfo = useSelector((state) => state.stocks)
  const [isLoaded, setIsLoaded] = useState(false)
  const [toggle, setToggle] = useState(false);
  const [errors, setErrors] = useState({});
  const [portfolioId, setPortfolioId] = useState(portfolio.id)
  const [backendErrors, setBackendErrors] = useState(false);
  const [tickerSymbol, setTickerSymbol] = useState(portfolio.symbol);
  const [called, setCalled] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [estimate, setEstimate] = useState("");
  const [submitToggle, setSubmitToggle] = useState(false);

  if (!currentUser) history.push("/login");

  useEffect(() => {

    setEstimate((avgPrice * quantity).toFixed(2));
    if(portfolio.symbol) setIsLoaded(true)
    if (submitToggle) {
      let newErrors = {};

      if (currentUser !== null) {
        if (quantity <= 0) newErrors.quantity = "Quantity is Required";
        if (quantity < portfolio.quantity && !newErrors.quantity) newErrors.quantity = 'You cannot Sell More Shares Than You Own'
        if (tickerSymbol === "") newErrors.ticker = "Ticker Symbol is required";
        if (avgPrice <= 0) newErrors.price = "Price is Required";
      }

      setErrors({ ...newErrors });
      if (errors && Object.values(newErrors).length > 0) return errors;
    }

    const closeModal = () => {
      setCalled(false);
      setSubmitToggle(false);
      setTickerSymbol("");
      setAvgPrice("");
      setQuantity("");
      setEstimate("");
    };

    if (called) {
      document.addEventListener("click", closeModal);

      return () => document.removeEventListener("click", closeModal);
    }
  }, [avgPrice, quantity, submitToggle, called]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitToggle(true);
    let id = currentUser?.id;
    let sold_at = new Date()
    let portfolio = { id, tickerSymbol, quantity, avgPrice, sold_at, portfolioId};
    if (!Object.values(errors).length) {
      const response = await dispatch(
        portfolioActions.updatePortfolioItem(portfolio)
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setBackendErrors(data.errors);
      });
      console.log(response)
      setCalled(true);
      return response;
    }
  };

  const UlClassName = "overlay" + (toggle ? "" : "hidden");

  const toggleModal = () => {
    setToggle(true);
  };
  const checkModal = () => {
    if (toggle) {
      return (
        <div className={UlClassName}>
          <div id="sell-stock-form">
            How Many Shares of {portfolio.name} Would You Like To Sell?
            <form id="sell-stock-form">
              <label>
                {" "}
                Quantity
                <input
                 id="sell-form-quantity-input"
                 name="quantity"
                 placeholder="Quantity"
                 value={quantity}
                 onChange={(e) => setQuantity(e.target.value)}
                 required>
                </input>
              </label>

              <label>Price
              <input
            id="sell-form-price-input"
            name="Average price"
            placeholder={stockInfo[portfolio.symbol]['Time Series (Daily)'][stockInfo[portfolio.symbol]['Time Series (Daily)'].length -1]}
            value={avgPrice}
            onChange={(e) => setAvgPrice(e.target.value)}
            required
            default={stockInfo[portfolio.symbol]['Time Series (Daily)'][stockInfo[portfolio.symbol]['Time Series (Daily)'].length -1]}
          ></input>
              </label>

              <div>Are You Sure You Would Like to Sell {quantity} shares of {portfolio.name} for {estimate}?
              <button onClick={handleSubmit}>Yes</button> <button>No</button></div>
            </form>
          </div>
        </div>
      );
    }
  };

  return ( portfolio?.quantity === 0 ? null :
    <div id="stock-asset-container">
      <div className="stock-asset-item">{portfolio.name}</div>
      <div className="stock-asset-item">{portfolio.symbol}</div>
      <div className="stock-asset-item">{portfolio.quantity}</div>
      <div className="stock-asset-item">${portfolio.avgPrice}</div>
      <div className="stock-asset-item">{portfolio.created_at}</div>
      <div className="stock-asset-item">
        {portfolio.sold_at ? portfolio.sold_at : ""}
      </div>
      <button className="stock-asset-item" onClick={toggleModal}>
        Sell Stock
      </button>
      {checkModal()}
    </div>
  );
}

export default SellStockForm;
