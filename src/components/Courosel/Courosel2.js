import React, { useState, useEffect } from "react";
import classes from "./Courosel2.module.css";
import image1 from "../../assets/b1.jpg";
import image2 from "../../assets/b2.jpg";
import image3 from "../../assets/b3.jpg";
import image4 from "../../assets/b4.jpg";
import image5 from "../../assets/b5.jpg";
import image6 from "../../assets/b6.jpg";

const Courosel2 = () => {
    const imageArray = [image1, image2, image3, image4, image5, image6];
    const quotes = ["In the pages of a book, you can find a friend waiting to share their story with you.",
                    "The reading of all good books is like a conversation with the finest minds of past centuries.",
                    "A book is a gift you can open again and again.",
                    "In the world of books, every page is a friend waiting to be discovered.",
                    "Books have a unique way of stopping time in a particular moment and saying: Let’s not forget this.",
                    "A book is a door to another world, waiting for you to turn the key of imagination and step through.",
                    "The beauty of a book lies not just in its words but in the worlds it unlocks within us.",
                    "Books are like imprisoned souls till someone takes them down from a shelf and frees them.",
                    "There are many little ways to enlarge your world. Love of books is the best of all.",
                    "In the vast library of life, each book is a chapter waiting to be explored, each page a story waiting to be told."
                  ]
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageArray.length);
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length)
    }, 5000); // Change 2000 to the interval time you prefer in milliseconds
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once on mount
  return (
    <div className={classes.couroselimage}>
      <div className={classes.container}>
        <div className={classes.text}>{quotes[currentQuoteIndex]}</div>
        <div className={classes.image} style={{backgroundImage: `linear-gradient(to left, transparent, #131315 100%), url(${imageArray[currentImageIndex]})`}}></div>
      </div>
      <div className={classes.dotscontainer}>
        {imageArray.map((image, imageIndex) => (
          <div className={`${classes.dot} ${imageIndex === currentImageIndex ? classes.activedot : ''}`} key={imageIndex} onClick={() => {setCurrentImageIndex(imageIndex); setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length)}}><i class="bi bi-circle-fill"></i></div>
        ))}
      </div>
    </div>
  )};


export default Courosel2;
