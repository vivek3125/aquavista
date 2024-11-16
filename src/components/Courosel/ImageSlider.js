import React, { useState, useEffect } from 'react'
import first from '../../assets/slideshow1.jpg'
const ImageSlider = ({slides, headings, descriptions}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderStyles = {
        height: '100%',
        position: 'relative',
    }
    const contentStyles = {
        width: '100%',
        height: '100%',
        display: 'flex',
    }
    const textStyles = {
        width: '40%',
        height: '100%',
        display: 'flex',
        paddingLeft: '5rem',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
    const heading = {
        width: '100%',
        padding: '1rem',
        textAlign: 'center',
        color: '#DB1A5A',
        fontSize: '4rem',
        fontWeight: 600,
        // color: 'white',
        // border: '1px solid gray',

    }
    const description = {
        width: '100%',
        padding: '0rem 1rem',
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: 400,
        color: 'white',
        // border: '1px solid gray',
    }
    const slideStyles = {
        width: '60%',
        height: '100%',
        backgroundSize: "cover",
        // backgroundSize: "contain",
        // backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        borderRadius: '0.5rem',
        // border: '1px solid purple',
        // backgroundImage: `url(${slides[currentIndex]})`,
        // backgroundImage: `linear-gradient(to bottom, #13131D, url(${slides[currentIndex]}))`,
        backgroundImage: `linear-gradient(to left, transparent, #131315 80%), url(${slides[currentIndex]})`,
        transition: 'background-image 0.5s ease', 
    }
    const leftArrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        left: '2rem',
        fontSize: '4rem',
        color: 'rgba(255, 255, 255, 0.2)',
        zIndex: 1,
        cursor: "pointer",
    }
    const rightArrowStyles = {
        position: 'absolute',
        top: '50%',
        transform: 'translate(0, -50%)',
        right: '2rem',
        fontSize: '4rem',
        color: 'rgba(255, 255, 255, 0.2)',
        zIndex: 1,
        cursor: "pointer",
    }
    const dotsContainerStyles = {
        position: 'absolute',
        left: 0,
        right: 0,
        margin: '0 auto',
        top:'90%',
        display: 'flex',
        justifyContent: 'center',
    }
    const dotStyles = {
        margin: "0rem 0.5rem",
        cursor: "pointer",
        fontSize: "0.5rem",
        color: 'rgba(255, 255, 255, 0.2)',
    }
    const activeDotStyles = {
        margin: "0rem 0.5rem",
        cursor: "pointer",
        fontSize: "0.5rem",
        color: 'rgba(255, 255, 255, 0.8)',
    }
    
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? slides.length-1 : currentIndex-1;
        setCurrentIndex(newIndex)
    }
    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length-1
        const newIndex = isLastSlide ? 0 : currentIndex+1;
        setCurrentIndex(newIndex)
    }
    const goToSlide = slideIndex => {
        setCurrentIndex(slideIndex);
    }
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
        }, 2000); // Change 2000 to the interval time you prefer in milliseconds
        return () => clearInterval(interval);
      }, []); // Empty dependency array ensures this effect runs only once on mount
  return (
    <div style={sliderStyles}>
        <div style={leftArrowStyles} onClick={goToPrevious}>&#10094;</div>
        <div style={rightArrowStyles} onClick={goToNext}>&#10095;</div>
        <div style={dotsContainerStyles}>
        {slides.map((slide, slideIndex) => (
            <div key={slideIndex} style={slideIndex === currentIndex ? activeDotStyles : dotStyles} onClick={() => goToSlide(slideIndex)} ><i class="bi bi-circle-fill"></i></div>
        ))}
      </div>
      <div style={contentStyles}>
        <div style={textStyles}>
            <div style={heading}>{headings[currentIndex]}</div>
            <div style={description}>{descriptions[currentIndex]}</div>
        </div>
        <div style={slideStyles}></div>
      </div>
    </div>
  )
}

export default ImageSlider
