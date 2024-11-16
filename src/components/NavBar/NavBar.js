import React, { useRef } from "react";
import classes from './NavBar.module.css';
import { Link, useNavigate } from "react-router-dom";
import { CATEGORY } from "./category";
import Cookies from "js-cookie";

const NavBar = () => {
    const navRef = useRef(null)
    const navigate = useNavigate();
    const utilityToken = () => {
      const value = Cookies.get('token');
      let token = '';
      if (value) {
          token = JSON.parse(value).value;
      }
      return token;
  }
    const scrollLeft = () => {
        if (navRef.current) {
          navRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
      };
    
      const scrollRight = () => {
        if (navRef.current) {
          navRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
      };
      const addToMostExploredCategory = async(category) => {
        try{
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/buyer/addcategory`, {
                method: 'POST',
                body: JSON.stringify({category}),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (!response.ok) {
                console.log(data.error);
                // throw new Error('didnot add product to recent explored!');
                // console.log('didnot add product to recent explored!');

            }
        }catch(err){
            console.log(err);
        }
    }
      const handleClick = (category) =>{
        // console.log(category);
        if(utilityToken()) addToMostExploredCategory(category);
        navigate(`/display?key=CATEGORY&value=${category}`)

      }
    return (
        <div className={classes.navbar}>
            <button className={classes.arrow} onClick={scrollLeft}>&#10094;</button>
            <div className={classes.navbarlist} ref={navRef}>
              {CATEGORY.map((category, index) => (
                <div key={index} className={classes.navdata} onClick={() => handleClick(category)}>{category}</div>
              ))}
            </div>
            <button className={classes.arrow} onClick={scrollRight}>&#10095;</button>
        </div>
    )
};

export default NavBar;
