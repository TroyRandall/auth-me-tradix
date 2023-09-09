import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Testing () {

const currentUser = useSelector((state) => state.session.user)
const portfolios = useSelector((state) => state.portfolios)
const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
    const loadData = async () => {
         await dispatch(
    portfolioActions.getPortfoliosByUser(userId))
    }

    loadData().then(() => setIsLoaded(true))

})

return (isLoaded &&
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
