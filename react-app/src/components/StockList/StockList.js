import "./StockList.css";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"
import { useParams } from 'react-router-dom'
import * as watchlistAction from '../../store/watchlist';

function StockList({ assetID, assetSymbol }) {
    const dispatch = useDispatch();
    const { ticker } = useParams()
    const sessionUser = useSelector(state => state.session.user);
    const watchlists = useSelector(state => state.watchlists.watchlists);
    const [newEditName, setNewEditName] = useState("");
    const [mainWatchlist, setMainWatchlist] = useState("");
    const [newWatchlist, setNewWatchlist] = useState("");
    const [additionComplete, setAdditionComplete] = useState(false);
    const createListForm = useRef(null);
    const CRL = useRef("");
    const [checked, setChecked] = useState(false);

    useEffect(() => {

      if (sessionUser) {
        dispatch(watchlistAction.fetchUserWatchlists(sessionUser.id));
      }
    }, [dispatch, sessionUser, mainWatchlist]);

    const submitWatchlist = async e => {
      e.preventDefault();
      if (!sessionUser) return;

      dispatch(watchlistAction.createWatchlist(newWatchlist, sessionUser.id)).then(() =>
        dispatch(watchlistAction.fetchUserWatchlists(sessionUser.id))
      );
    };

    const submitAddAsset = async e => {
      dispatch(watchlistAction.addToWatchlist(mainWatchlist, ticker)).then(() =>
        dispatch(watchlistAction.fetchUserWatchlists(sessionUser.id))
      );

      setAdditionComplete(true);
      await setTimeout(() => {
        setAdditionComplete(false);
      }, 1500);
    };

    if (!watchlists) {
      return null;
    }

    const hideAddListForm = () => {
      createListForm.current.classList.add("hidden");
      CRL.current.classList.remove("hidden");
      setNewWatchlist("");
    };

    const hideAddListForm2 = () => {
      createListForm.current.classList.add("hidden");
      CRL.current.classList.remove("hidden");
    };

    const showAddListForm = () => {
      createListForm.current.classList.remove("hidden");
      CRL.current.classList.add("hidden");
    };

    if (sessionUser && watchlists) {
      return (
        <>
          <div className="allLists2">
            <div>
              <h2 className="showAddListForm" onClick={showAddListForm} ref={CRL}>
                {" "}
                + Create New List
              </h2>
            </div>
            <form
              onSubmit={submitWatchlist}
              ref={createListForm}
              className=" hidden addWatchListForm"
            >
              <input
                value={newWatchlist}
                onChange={e => setNewWatchlist(e.target.value)}
                required
                placeholder="List Name"
                className="addWatchListInput"
                type="list"
              ></input>
              <button
                type="submit"
                onClick={hideAddListForm2}
                className="createListButton"
              >
                Create List
              </button>
              <button
                type="submit1"
                onClick={hideAddListForm}
                className="cancelCreateButton"
              >
                Cancel
              </button>
            </form>

            {Object.keys(watchlists).map((key, index) =>
              mainWatchlist === watchlists[key].id ? (
                <div className="edit-form2" style={{ color: "rgb(0, 185, 5)" }}>
                  <h2
                    className={`watchlistItems wl${watchlists[key].id}`}
                    onClick={() => setMainWatchlist(watchlists[key].id)}
                    key={watchlists[key].id}
                  >
                    {watchlists[key].name}
                  </h2>
                </div>
              ) : (
                <div className="edit-form2">
                  <h2
                    className={`watchlistItems wl${watchlists[key].id}`}
                    onClick={() => setMainWatchlist(watchlists[key].id)}
                    key={watchlists[key].id}
                  >
                    {watchlists[key].name}
                  </h2>
                </div>
              )
            )}
          </div>

          <button onClick={submitAddAsset} className="SaveChangesButton">
            Save Changes
          </button>
          {mainWatchlist && additionComplete ? (
            <p
              style={{
                color: "rgb(0, 185, 5)",
                textAlign: "center",
                marginTop: "20px",
                fontWeight: "1000",
              }}
            >
              {assetSymbol} has been added to {watchlists[mainWatchlist]?.name}
            </p>
          ) : (
            <p
              style={{
                color: "rgb(0, 185, 5)",
                textAlign: "center",
                marginTop: "39px",
              }}
            ></p>
          )}
        </>
      );
    }
  }

  export default StockList;
