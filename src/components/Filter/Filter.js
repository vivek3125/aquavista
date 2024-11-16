import React, { useState } from 'react'
import classes from './Filter.module.css';
import {CATEGORY} from '../../utility';

const Filter = ({onFilterChange}) => {
    const [priceRange, setPriceRange] = useState(2000);
    const [discountRange, setDiscountRange] = useState(0);
    const [buyingperiod, setBuyingPeriod] = useState('');
    const [languages, setLanguages] = useState([]);
    const [categories, setCategories] = useState([]);

    const handleBuyingPeriodChange = (value) => {
      setBuyingPeriod(buyingperiod === value ? '' : value);
    };
    const handleLanguageChange = (e) => {
        const selectedLanguages = [...languages];
        if (e.target.checked) {
          selectedLanguages.push(e.target.value);
        } else {
          const index = selectedLanguages.indexOf(e.target.value);
          if (index > -1) {
            selectedLanguages.splice(index, 1);
          }
        }
        setLanguages(selectedLanguages);
      };
      const handleCategoryChange = (e) => {
        const selectedCategories = [...categories];
        if (e.target.checked) {
          selectedCategories.push(e.target.value);
        } else {
          const index = selectedCategories.indexOf(e.target.value);
          if (index > -1) {
            selectedCategories.splice(index, 1);
          }
        }
        setCategories(selectedCategories);
      };
      const handleSubmit = (e) => {
        e.preventDefault();
        const filters = {
          priceRange,
          discountRange,
          buyingperiod,
          languages,
          categories,
        };
        onFilterChange(filters);
      }
  return (
    <div className={classes.filtercomponent}>
      <form onSubmit={handleSubmit}>
      <div className={classes.price}>
        <div className={classes.heading}>Price</div>
        <span>&#8377;50 - &#8377;{priceRange}</span>
        <input type='range' min={50} max={2000} value={priceRange} onChange={(e)=>setPriceRange(e.target.value)}></input>
      </div>
      <div className={classes.discount}>
        <div className={classes.heading}>Discount</div>
        <span>0% - {discountRange}%</span>
        <input type='range' min={0} max={100} value={discountRange} onChange={(e)=>{setDiscountRange(e.target.value)}}></input>
      </div>
      <div className={classes.buyingperiod}>
          <div className={classes.heading}>Buying Period</div>
          <label><input type="checkbox" name="buyingPeriod" value="0-1" checked={buyingperiod === '0-1'} onChange={()=>handleBuyingPeriodChange('0-1')}/>Between 0-1 years</label>
          <label><input type="checkbox" name="buyingPeriod" value="1-2" checked={buyingperiod === '1-2'} onChange={()=>handleBuyingPeriodChange('1-2')}/>Between 1-2 years</label>
          <label><input type="checkbox" name="buyingPeriod" value="2-3" checked={buyingperiod === '2-3'} onChange={()=>handleBuyingPeriodChange('2-3')}/>Between 2-3 years</label>
          <label><input type="checkbox" name="buyingPeriod" value="3" checked={buyingperiod === '3'} onChange={()=>handleBuyingPeriodChange('3')}/>More than 3 years</label>
      </div>
      <div className={classes.language}>
        <div className={classes.heading}>Language</div>
          <label><input type="checkbox" value="hindi" checked={languages.includes('hindi')} onChange={handleLanguageChange}/>Hindi</label>
          <label><input type="checkbox" value="english" checked={languages.includes('english')} onChange={handleLanguageChange}/>English</label>
          <label><input type="checkbox" value="chinese" checked={languages.includes('chinese')} onChange={handleLanguageChange}/>Chinese</label>
      </div>
      <div className={classes.category}>
          <div className={classes.heading}>Genre/ Category</div>
          {CATEGORY.map((category, index) => (
            <label key={index}>
              <input
                type="checkbox"
                value={category}
                checked={categories.includes(category)}
                onChange={handleCategoryChange}
              />
              {category}
            </label>
          ))}
      </div>
      <div className={classes.btn}>
        <button type="submit">Apply</button>
      </div>
      </form>
    </div>
  )
}

export default Filter
