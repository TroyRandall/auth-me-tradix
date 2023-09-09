import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SellStockForm from "../StockSellForm";
import * as portfolioActions from "../../store/portfolio";

function Testing () {
const dispatch = useDispatch()
const currentUser = useSelector((state) => state.session.user)
const portfolios = useSelector((state) => state.portfolios)
const [isLoaded, setIsLoaded] = useState(false);



useEffect(() => {
    const loadData = async () => {
        if(currentUser?.id) {
               await dispatch(
    portfolioActions.getPortfoliosByUser(currentUser.id))
        }

    }

    loadData().then(setTimeout(setIsLoaded(true)))

}, [currentUser])

return (currentUser?.id &&
    <div id="portfolio-assets">
    <div id="stock-asset-container">
      <div className="stock-asset-item">Name</div>
      <div className="stock-asset-item">Symbol</div>
      <div className="stock-asset-item">Quantity</div>
      <div className="stock-asset-item">Average Price</div>
      <div className="stock-asset-item">Purchased On</div>
      <div className="stock-asset-item">Sold On</div>
      <div className="stock-asset-item">Sell Stock Button</div>
    </div>
    {isLoaded &&
      Object.values(portfolios[currentUser.id]).map((portfolio) => {
        return (
          <SellStockForm
            portfolio={portfolio}
            stocksIsLoaded={isLoaded}
          />
        );
      })}
      </div>
)

}

export default Testing
