import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as searchActions from '../../store/search'
import { Link } from 'react-router-dom'
import styles from './style.module.css'
import { stockTickerSearch } from '../../store/tickers'


const Search = () => {
  const [keyword, setKeyword] = useState('')
  const [showSearchRes, setShowSearchRes] = useState(false)
  const [isSearchLoaded, setIsSearchLoaded] = useState(false)
  const [searchRes, setSearchRes] = useState([])
  const [isHoveringOnSearchRes, setIsHoveringOnSearchRes] = useState(false)
  const dispatch = useDispatch()

  const searchInput = e => {
    if(/^[A-Za-z]*$/.test(e.target.value))
      setKeyword(e.target.value)
  }

  const clearSearch = () => {
    if(!isHoveringOnSearchRes)
      setShowSearchRes(false)
  }

  const searchResStyling = (str, word) => {
    const idx = str.toLowerCase().indexOf(word.toLowerCase())
    const len = word.length

    return idx >= 0 ? (
      <><span>{str.substring(0, idx)}</span><span className={styles.searchKeyword}>{str.substring(idx, idx + len)}</span><span>{str.substring(idx + len)}</span></>
    ) : <span>{str}</span>
  }
  const handleSearch = async(keyword) => {
    let test = await dispatch(stockTickerSearch(keyword));

  };
  // const tickerSymbol = res["1. symbol"];

  useEffect(() => {
      setIsSearchLoaded(false)

      if (Object.values(keyword).length > 1) {
        setShowSearchRes(true)
        const url = `/api/stocks/${keyword}`

        dispatch(stockTickerSearch(keyword))
            // .then(res => res.json())

            .then(res => {
            setSearchRes(res)
            setIsSearchLoaded(true)
        })
      }else{
        setShowSearchRes(false)
        setSearchRes([])
      }

  }, [keyword])
  return (
    <div className={styles.searchContainer}>
      <input
        type='text'
        onChange={searchInput}
        onBlur={clearSearch}
        onFocus={() => {setShowSearchRes(!!(searchRes.length || keyword.length))}}
        value={keyword}
        className={styles.searchBar}
      />
      <div className={styles.iconContainer}><i className="fa-solid fa-magnifying-glass fa-lg"></i></div>
      {
        showSearchRes &&
        <ul
          className={styles.searchResult}
          onMouseEnter={() => setIsHoveringOnSearchRes(true)}
          onMouseLeave={() => setIsHoveringOnSearchRes(false)}
        >
         {Array.isArray(searchRes.bestMatches) && searchRes.bestMatches.length > 0 ? (
  searchRes.bestMatches.map((res) => (
    <Link to={`/stocks/${res["1. symbol"]}`} key={res["1. symbol"]}>
      <li
        className={styles.resultItem}
        onClick={() => {
          setIsHoveringOnSearchRes(false);
          setKeyword('');
          setSearchRes([]);
        }}
      >
        <div className={styles.symbolContainer}>{res["1. symbol"]}</div>
        <div className={styles.companyContainer}>{res["2. name"]}</div>
      </li>
    </Link>
  ))
) : isSearchLoaded ? (
  <li style={{ padding: '4px 1rem' }}>No search result</li>
) : (
  <li style={{ padding: '4px 1rem' }}>Loading...</li>
)}

        </ul>
      }
    </div>
  );


  // return (
  //     <div className={styles.searchContainer}>
  //       <input
  //         type='text'
  //         onChange={searchInput}
  //         onBlur={clearSearch}
  //         onFocus={() => {setShowSearchRes(!!(searchRes.length || keyword.length))}}
  //         value={keyword}
  //         className={styles.searchBar}
  //       />
  //       <div className={styles.iconContainer}><i className="fa-solid fa-magnifying-glass fa-lg"></i></div>
  //       {
  //         showSearchRes &&
  //         <ul
  //           className={styles.searchResult}
  //           onMouseEnter={() => setIsHoveringOnSearchRes(true)}
  //           onMouseLeave={() => setIsHoveringOnSearchRes(false)}
  //         >
  //           {
  //           !!searchRes.length ?
  //             searchRes.map(res =>
  //               <Link to={`/stocks/${res.ticker}`}>
  //                 <li
  //                     className={styles.resultItem}
  //                     key={res.symbol}
  //                     onChange={handleSearch}
  //                     onClick={() => {
  //                       // handleSearch(res.ticker)
  //                       // dispatch(stockTickerSearch(res.ticker))
  //                       setIsHoveringOnSearchRes(false)
  //                       setKeyword('')
  //                       setSearchRes([])
  //                     }}
  //                 >
  //                   <div className={styles.symbolContainer}>{searchResStyling(res.symbol, keyword)}</div>
  //                   <div className={styles.companyContainer}>{searchResStyling(res.name, keyword)}</div>
  //                 </li>
  //               </Link>) :
  //               isSearchLoaded && <li style={{padding: '4px 1rem'}}>No search result</li>
  //           }
  //         { !isSearchLoaded && <li style={{padding: '4px 1rem'}}>Loading...</li> }
  //       </ul>
  //     }
  //   </div>
  // )

}

export default Search
