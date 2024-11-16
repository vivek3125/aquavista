import React, { useState, useEffect } from "react";
import classes from './Courosel.module.css';
import first from '../../assets/slideshow1.jpg';
import second from '../../assets/slideshow2.jpg';
import third from '../../assets/slideshow3.jpg';
import fantasy from '../../assets/fantasy.jpg';
import horror from '../../assets/horror.jpg';
import thriller from '../../assets/thriller.jpg';
import adventure from '../../assets/adventure.jpg';
import travel from '../../assets/travel.jpg';
import science from '../../assets/science.jpg';
import ImageSlider from "./ImageSlider";

const Carousel = () => {
    const slides = [fantasy, horror, thriller, adventure, travel, science];
    const headings = ["Realm of Magic", "Shadows of Fear","Suspense Unleashed","Courageous Expeditions","Journey Through Pages","Cosmic Exploration"];
    const descriptions = ["Step into a world where dreams take flight and magic reigns supreme. From enchanted forests to mythical      creatures, immerse yourself in tales of wonder and adventure where anything is possible.",
    " Dare to enter the realm where fear lurks in the shadows, waiting to consume. From haunted houses to ancient curses, brace yourself for spine-chilling tales that will haunt your nightmares.",
    "Hold your breath as suspense grips you with every twist and turn. From heart-pounding mysteries to gripping conspiracies, prepare for a rollercoaster ride of adrenaline-fueled thrills that will keep you on the edge of your seat.",
    "Join brave souls as they lead the way on paths untrodden. From treacherous mountains to uncharted seas, embrace the spirit of adventure and discover the thrill of exploring the unknown.",
    "Embark on a literary journey to destinations far and wide, one page at a time. From exotic landscapes to cultural odysseys, let the words transport you to new worlds and inspire your wanderlust.",
    "Explore the wonders of the cosmos, from atoms to galaxies, as you delve into the depths of scientific discovery. From groundbreaking theories to mind-bending experiments, embark on a voyage of intellectual exploration that will expand your horizons."
    ]

    return (
        <div style={{height:'34rem'}}>
            <ImageSlider slides={slides} headings={headings} descriptions={descriptions}/>
        </div>
    )
};

export default Carousel;
