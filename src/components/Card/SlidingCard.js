import React, {useRef} from 'react'
import classes from './SlidingCard.module.css';
import cardimage from '../../assets/slideshow1.jpg';
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";
import { getPostedTime2 } from '../../utility';

const SlidingCard = ({heading , products, isNewAdded=false}) => {
    const slider = useRef(null)
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
        if (slider.current) {
            slider.current.scrollBy({ left: -260, behavior: 'smooth' });
        }
      };
    
      const scrollRight = () => {
        if (slider.current) {
            slider.current.scrollBy({ left: 260, behavior: 'smooth' });
        }
      };
      const getImage = (title,image,sellerId) => {
        if(image) return `http://localhost:8080/${sellerId}/${title}/${image}`;
        return cardimage
      };

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
        if(utilityToken()) addToRecentExplored(productId);
        navigate(`/product/${productId}`);
      }
  return (
    <div className={classes.slidercontainer}>
      <h1 className={classes.heading}>{heading}</h1>
      <div className={classes.slider}>
        <button className={classes.arrow} onClick={scrollLeft} style={{borderRadius:'0rem 0.2rem 0.2rem 0rem'}}>&#10094;</button>
        <div className={classes.itemlist} ref={slider}>
            {/* <div className={classes.item}>
            <Link to='/product'>
                <div className={classes.cardimage}><img src={cardimage} alt="image not found"/></div>
                <h1 className={classes.title}>One More Lie</h1>
            </Link>
            <h1 className={classes.author}>by Array upadi</h1>
                <div className={classes.price}>
                        <span className={classes.sellingprice}>&#8377;200</span>
                        <span className={classes.mrp}>&#8377;450</span>
                        <span className={classes.discount}>-20%</span>
                </div>
            </div> */}
            {
                products.map((product)=>(
                    <div className={classes.item} onClick={() => handleClick(product._id)}>
                    {/* <Link to={`/product/${product._id}`}> */}
                        <div className={classes.cardimage}><img src={getImage(product.title, product.image, product.sellerId)} alt="image not found"/></div>
                        <h1 className={classes.title}>{product.title}</h1>
                    {/* </Link> */}
                    <h1 className={classes.author}>by {product.author}</h1>
                        <div className={classes.price}>
                                <span className={classes.sellingprice}>&#8377;{product.price}</span>
                                <span className={classes.mrp}>&#8377;{product.mrp}</span>
                                <span className={classes.discount}>-{Math.round(product.discount)}%</span>
                        </div>
                        {isNewAdded && <div className={classes.sellerdetail}>
                            <span className={classes.posteddate}>{getPostedTime2(product.postedDate)}</span>
                        </div>}
                    </div>
                ))
            }
        </div>
        <button className={classes.arrow} onClick={scrollRight} style={{borderRadius:'0.2rem 0rem 0rem 0.2rem'}}>&#10095;</button>
      </div>
    </div>
  )
}

export default SlidingCard 
