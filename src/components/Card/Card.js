import React from "react";
import classes from './Card.module.css';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from '../../store/auth-context';
import { useContext, useState } from 'react';
import { getPostedTime2 } from '../../utility';

const Card = ({ _id, sellerId, title, author, image, mrp, price, discount, sold, cartState, postedDate, address }) => {

    const { loginChangeHandler, logoutShowModelOpen } = useContext(AuthContext);
    const [addOrRemove, setAddOrRemove] = useState(cartState);

    const addToCart = async () => {
        try {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/buyer/cart/${_id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Added to Cart !');
                setAddOrRemove(true);
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        }catch(err){    
            console.log(err);
        }
    }

    const removeFromCart = async () => {
        try{
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/buyer/cart/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Deleted From Cart !');
                setAddOrRemove(false);
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div className={classes.card}>
            <Link to={`/product/${_id}`}>
                <div className={classes.cardimage}><img src={`http://localhost:8080/${sellerId}/${title}/${image}`} alt="image not found" /></div>
                <h1 className={classes.title}>{title}</h1>
            </Link>
            <h1 className={classes.author}>- by {author}</h1>
            <div className={classes.infocontainer}>
                <div className={classes.price}>
                    {/* <div className={classes.leftbottom}> */}
                    <div>
                        <span className={classes.sellingprice}>&#8377;{price}</span>
                        <span className={classes.mrp}>&#8377;{mrp}</span>
                        <span className={classes.discount}>{Math.round(discount)}% Off</span>
                    </div>
                    {/* </div> */}
                    {/* <p className={classes.mrp}>MRP : &#8377; {mrp}</p> */}
                    {
                        sold === 0 ?
                            <div className={classes.instock}>In Stock</div> :
                            <div className={classes.outofstock}>Out of Stock</div>
                    }
                </div>
                <div className={classes.addToCart}>
                    {
                        addOrRemove === false ?
                        <button className={classes.cartbutton} onClick={() => addToCart()}><i class="bi bi-cart3"></i></button>
                        : 
                        <button className={classes.cartbutton} onClick={() => removeFromCart()}><i class="bi bi-cart-x"></i></button>
                    }
                </div>
            
            </div>
            <div className={classes.sellerdetail}>
                <span className={classes.address}>{address}</span>
                <span className={classes.posteddate}>{getPostedTime2({postedDate})}</span>
            </div>
        </div>
    )
};

export default Card