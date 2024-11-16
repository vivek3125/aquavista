import React from 'react'
import classes from './SideCard.module.css';

const SideCard = ({isYourProducts = false, sellRecord={}, isYourCart=false, cartRecord={}}) => {
  return (
    <div className={classes.cardcontainer}>
        {isYourProducts && 
          <>
            <h1>Your Selling</h1>
            <hr></hr>
            <div className={classes.detail}><span>Total items listed for sale:</span> <span>{sellRecord.totalItems}</span></div>
            <div className={classes.detail}><span>Total items successfully sold:</span> <span>{sellRecord.totalSold}</span></div>
            <div className={classes.detail}><span>Number of products available for sale:</span> <span>{sellRecord.totalAvailable}</span></div>
            <div className={classes.detail}><span>Percentage of products sold:</span> <span>{sellRecord.percentageSold}%</span></div>
            <hr></hr>
            <div className={classes.detailbottom}><span style={{fontSize:'1rem', fontWeight: 600, color: 'white'}}>Total revenue from sales:</span> <span style={{fontSize:'1rem', fontWeight: 600, color: 'white'}}>&#8377;{sellRecord.totalRevenue}</span></div>
            <hr></hr>
            <div className={classes.detailbottom}><span>You earned &#8377;{sellRecord.totalEarning} from sales</span></div>
          </>
        }

        {isYourCart && 
          <>
            <h1>Your Cart</h1>
            <hr></hr>
            <div className={classes.detail}><span>Price ({cartRecord.totalItems}):</span> <span>&#8377;{cartRecord.totalMrp}</span></div>
            <div className={classes.detail}><span>Discount:</span> <span>- &#8377;{cartRecord.totalDiscount}</span></div>
            <hr></hr>
            <div className={classes.detailbottom}><span style={{fontSize:'1rem', fontWeight: 600, color: 'white'}}>Total Amount:</span> <span style={{fontSize:'1rem', fontWeight: 600, color: 'white'}}>&#8377;{cartRecord.totalPrice}</span></div>
            <hr></hr>
            <div className={classes.detailbottom}><span>You will save &#8377;{cartRecord.totalDiscount}</span></div>
          </>
        }
   </div>
  )
}

export default SideCard
