import { useState, useEffect} from "react";
import { useDispatch, useSelector,   } from "react-redux";
import { useParams } from "react-router-dom";
import { authenticate } from "../../store/session";

import * as portfolioActions from "../../store/portfolio";
import './StockSellForm.css'

function SellStockForm({ portfolio }) {
  const dispatch = useDispatch();
  const { userId } = useParams()
  const currentUser = useSelector((state) => state.session.user);
  const stockInfo = useSelector((state) => state.stocks)
  const portfolios = useSelector((state) => state.portfolios[userId]);
  const [isLoaded, setIsLoaded] = useState(false)
  const [toggle, setToggle] = useState(false);
  const [errors, setErrors] = useState({});
  const [portfolioId, setPortfolioId] = useState(portfolio.id)
  const [tickerSymbol, setTickerSymbol] = useState(portfolio.symbol);
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [estimate, setEstimate] = useState("");
  const [submitToggle, setSubmitToggle] = useState(false);


  useEffect(() => {

    setEstimate((avgPrice * quantity).toFixed(2));
    if(portfolio.symbol) setIsLoaded(true)
    if (submitToggle) {
      let newErrors = {};

        if (quantity <= 0) newErrors.quantity = "Quantity is Required";
        if (quantity > portfolio.quantity && !newErrors.quantity) newErrors.quantity = 'You cannot Sell More Shares Than You Own'
        if (tickerSymbol === "") newErrors.ticker = "Ticker Symbol is required";
        if (avgPrice <= 0) newErrors.price = "Price is Required";


      setErrors({ ...newErrors });
      if (errors && Object.values(newErrors).length > 0) return errors;
    }

  }, [avgPrice, quantity, submitToggle, portfolios]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitToggle(true);
    let id = currentUser?.id;
    let sold_at = new Date()
    let portfolio = { id, tickerSymbol, quantity, avgPrice, sold_at, portfolioId};
    if (!errors.length) {
      const response = await dispatch(
        portfolioActions.updatePortfolioItem(portfolio)
      ).catch(async (res) => {
        const data = res;
        if (data && data.errors) setErrors(data.errors);
      });
      if(errors.length){
        setToggle(false)
        setSubmitToggle(false);
      }
      await dispatch(portfolioActions.getPortfoliosByUser(userId))
      await dispatch(authenticate())
      return response;
    }
  };

  const cancelModal = (e) => {
    const overlay = document.getElementById('overlay');
    const yesButton = document.getElementById('yes-button')
    const noButton = document.getElementById('no-button')
    if(e.target !== overlay && e.target !== noButton) return null
    else if (e.target === yesButton) {
      let newErrors = {};

        if (quantity <= 0) newErrors.quantity = "Quantity is Required";
        if (quantity > portfolio.quantity && !newErrors.quantity) newErrors.quantity = 'You cannot Sell More Shares Than You Own'
        if (tickerSymbol === "") newErrors.ticker = "Ticker Symbol is required";
        if (avgPrice <= 0) newErrors.price = "Price is Required";


      setErrors({ ...newErrors });
      if (errors && Object.values(newErrors).length > 0) return errors;
      else return handleSubmit()
    } else {
    setToggle(false)
    setSubmitToggle(false);
    }

  }

  const UlClassName = "overlay" + (toggle ? "" : "hidden");

  const toggleModal = () => {
    setToggle(true);
  };
  const checkModal = () => {
    if (toggle) {
      return (
        <div className={UlClassName} onClick={cancelModal} id='overlay'>
          <div id="sell-stock-form">
            {Object.values(errors).length ? Object.values(errors).map((error) => {
              return <div>{}</div>
            }) : ''}
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
              <button onClick={handleSubmit} id='yes-button'>Yes</button> <button onClick={cancelModal} id='no-button'>No</button></div>
            </form>
          </div>
        </div>
      );
    }
  };

  return ( portfolio?.quantity === 0 || portfolio?.sold_at ? null:
    <div id="stock-asset-container">
      <div className="stock-asset-item2">{portfolio.name}</div>
      <div className="stock-asset-item2">{portfolio.symbol}</div>
      <div className="stock-asset-item2">{portfolio.quantity}</div>
      <div className="stock-asset-item2">${portfolio.avgPrice}</div>
      <div className="stock-asset-item2">{portfolio.created_at}</div>
      <div className="stock-asset-item2">
        {portfolio.sold_at ? portfolio.sold_at : ""}
      </div>
      <button className="stock-asset-item3" onClick={toggleModal}>
        Sell Stock
      </button>
      {checkModal()}
    </div>
  );
}

export default SellStockForm;
