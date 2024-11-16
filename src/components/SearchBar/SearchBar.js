import React, { useState } from "react";
import classes from './SearchBar.module.css';
import filter from '../../assets/filter.png';
import search from '../../assets/search.png';

const SearchBar = () => {
    // till now state of what to search is saved here, but will be moved according to requirement 
    let [searchText, setSearchText] = useState();

    const searchTextChangeHandler = (event) => {
        setSearchText(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        
    }

    const filterhandler = () => {
        // filter the data here 
    }
    return (
        <div className={classes.header2}>
            <form method="POST" onSubmit={handleSubmit} className={classes.form}>
                <div><input type="text" className={classes.input} name="input" onChange={searchTextChangeHandler} required placeholder="type to search ... "/></div>
                <button type="submit" className={classes.searchbutton}><i className="bi bi-search"></i></button>
            </form>
            {/* <button onClick={filterhandler} className={classes.filterbutton}><img src={filter} /></button> */}
        </div>
    )
};

export default SearchBar;

