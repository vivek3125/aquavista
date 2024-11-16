import React, { useEffect, useState } from "react";
import classes from './Cart.module.css';
import HorizontalCard from "../Card/HorizontalCard";
import Cookies from 'js-cookie';
import { AuthContext } from '../../store/auth-context';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { getPostedTime } from '../../utility';
import SideCard from "../Card/SideCard";


const Cart = () => {
    const { loginChangeHandler, logoutShowModelOpen } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [cartRecord, setCartRecord] = useState({
        totalItems: 0,
        totalMrp: 0,
        totalPrice: 0,
        totalDiscount: 0,
    });

    useEffect(() => {
        const getCartProducts = async () => {
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch('http://localhost:8080/buyer/cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.cart);
                setCart(data.cart);
            } else {
                if (response.status === 402) {
                    loginChangeHandler(false);
                    logoutShowModelOpen();
                } else {
                    console.log(data.error);
                }
            }
        };
        getCartProducts();
    }, [])

    useEffect(() => {
        // Reset cartRecord to initial values
        setCartRecord({ totalItems: 0, totalMrp: 0, totalPrice: 0, totalDiscount: 0, });
        if (cart) {
            let totalItems = 0;
            let totalMrp = 0;
            let totalPrice = 0;

            cart.forEach(data => {
                totalItems++;
                totalMrp += data.product.mrp;
                totalPrice += data.product.price;
            });
            let totalDiscount = totalMrp - totalPrice;
            setCartRecord(prevState => ({
                ...prevState,
                totalItems,
                totalMrp,
                totalPrice,
                totalDiscount,
            }));
        }
    }, [cart]);

    const removeFromCart = async (productId) => {
        try{
            const value = Cookies.get('token');
            let token = '';
            if (value) {
                token = JSON.parse(value).value;
            }
            const response = await fetch(`http://localhost:8080/buyer/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Deleted From Cart !');
                const updatedCart = cart.filter(item => item.product._id !== productId);
                // Update the cart state with the new array
                setCart(updatedCart);
                // setCart(data.cart);
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
        <div className={classes.cart}>
            {cart.length === 0 ? <p className={classes.loading}>Loading !!</p>:
                <>
                <div className={classes.products}>
                    {cart && 
                    cart.map((data) => (
                        <HorizontalCard key={data.product._id}>
                            <div className={classes.horizontalcard}>
                                    <div className={classes.content}>
                                        <Link to={`/product/${data.product._id}`}>
                                            <div className={classes.image}>
                                                <img src={`http://localhost:8080/${data.product.sellerId}/${data.product.title}/${data.product.image1}`}></img>
                                            </div>
                                        </Link>
                                        <div className={classes.details}>
                                            <Link to={`/product/${data.product._id}`}>
                                                <div className={classes.title}>{data.product.title} - by {data.product.author}</div>
                                            </Link>
                                            <div className={classes.addeddate}><i class="bi bi-circle-fill"></i>Added on : {getPostedTime(data.time)}</div>
                                            <div className={classes.category}>Category: {data.product.category}</div>
                                            <div className={classes.language}>Language: {data.product.language}</div>
                                        </div>
                                        <div className={classes.amount}>
                                            <div>
                                            <span className={classes.mrp}>&#8377;{data.product.mrp}</span>
                                            <span className={classes.price}>&#8377;{data.product.price}</span>
                                            </div>
                                            <div className={classes.discount}>{Math.round((data.product.mrp-data.product.price)/(data.product.mrp)*100)}% Off</div>

                                        </div>

                                        <div className={classes.seller}>
                                            <div className={classes.name}><i class="bi bi-circle-fill"></i>About Seller</div>
                                            <div className={classes.contact}><i class="bi bi-envelope"></i>{data.product.email}</div>
                                            <div className={classes.contact}><i class="bi bi-telephone"></i>{data.product.phonenumber}</div>
                                            <div className={classes.address}><i class="bi bi-geo-alt"></i>{data.product.address}</div>
                                            <div className={classes.posteddate}><i class="bi bi-calendar"></i>{getPostedTime(data.product.updatedAt)}</div>
                                            {
                                                data.product.sold === 0 ?
                                                    <div className={classes.name}><span style={{color: 'green', fontSize: '1.2rem'}}>In Stock</span></div> :
                                                    <div className={classes.name}><span style={{color: 'red', fontSize: '1.2rem'}}>Out of Stock</span></div>
                                            }
                                        </div>
                                    </div>
                                <div className={classes.btn}>
                                    <button onClick={() => removeFromCart(data.product._id)}>REMOVE</button>
                                </div>

                            </div>
                        </ HorizontalCard>
                    ))
                    }
                </div>
                <div className={classes.sidecard}>
                    <SideCard isYourCart={true} cartRecord={cartRecord}/>
                </div>
                </>
            }
        </div>
    )
}

export default Cart;