import React from 'react'
import classes from './CardCombo.module.css';
import cardimage from '../../assets/slideshow1.jpg';
import cardcart from '../../assets/cardcart.jpg';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const CardCombo = ({heading, products}) => {
    const navigate = useNavigate();
    const utilityToken = () => {
        const value = Cookies.get('token');
        let token = '';
        if (value) {
            token = JSON.parse(value).value;
        }
        return token;
    }
    const getImage = (title,image,sellerId) => {
        if(image) return `http://localhost:8080/${sellerId}/${title}/${image}`;
        return cardimage
    }
    const addToRecentExplored = async (productId) =>  {
        // console.log("inside fetch single product");   
        const value = Cookies.get('token');
        let token = '';
        if (value) {
            token = JSON.parse(value).value;
        }
        const response = await fetch(`http://localhost:8080/buyer/recentexplored`, {
            method: 'POST',
            body: JSON.stringify({productId}),
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
    }
    const handleClick = (productId) => {
        if(productId){
            if(utilityToken()) addToRecentExplored(productId);
            navigate(`/product/${productId}`);
        }
      }
    // console.log(products[0]._id);
  return (
    <div>
        <div className={classes.cardCombo}>
            <h1 className={classes.heading}>
                {/* Under &#8377; 500| Unlock a world of reading pleasures */}
                {heading}
            </h1>
            <div className={classes.twoProduct}>
                <div className={classes.singleProduct} onClick={()=>handleClick(products[0]._id)}>
                    {/* <Link to={products[0]._id ? `/product/${products[0]._id}`: ''}> */}
                        <div className={classes.cardComboimage}><img src={getImage(products[0].title, products[0].image, products[0].sellerId)} alt="image not found"/></div>
                        <h1 className={classes.title}>{products[0].title}</h1>
                    {/* </Link> */}
                </div>
                <div className={classes.singleProduct} onClick={()=>handleClick(products[1]._id)}>
                    {/* <Link to={products[2]._id ? `/product/${products[1]._id}`: ''}> */}
                        <div className={classes.cardComboimage}><img src={getImage(products[1].title, products[1].image, products[1].sellerId)} alt="image not found"/></div>
                        <h1 className={classes.title}>{products[1].title}</h1>
                    {/* </Link> */}
                </div>
            </div>
            <div className={classes.twoProduct}>
                <div className={classes.singleProduct} onClick={()=>handleClick(products[2]._id)}>
                    {/* <Link to={products[2]._id ? `/product/${products[2]._id}` : ''}> */}
                        <div className={classes.cardComboimage}><img src={getImage(products[2].title, products[2].image, products[2].sellerId)} alt="image not found"/></div>
                        <h1 className={classes.title}>{products[2].title}</h1>
                    {/* </Link> */}
                </div>
                <div className={classes.singleProduct} onClick={()=>handleClick(products[3]._id)}>
                    {/* <Link to={products[3]._id ? `/product/${products[3]._id}`: ''}> */}
                        <div className={classes.cardComboimage}><img src={getImage(products[3].title, products[3].image, products[3].sellerId)} alt="image not found"/></div>
                        <h1 className={classes.title}>{products[3].title}</h1>
                    {/* </Link> */}
                </div>
            </div>
            {/* <div className={classes.rigt}>
                <Link to='/product'>
                    <div className={classes.cardimage}><img src={cardimage} alt="image not found"/></div>
                    <h1 className={classes.title}>One More Lie</h1>
                </Link>
                <Link to='/product'>
                    <div className={classes.cardimage}><img src={cardimage} alt="image not found"/></div>
                    <h1 className={classes.title}>One More Lie</h1>
                </Link>
            </div> */}
            
        </div>
    </div>
  )
}

export default CardCombo
