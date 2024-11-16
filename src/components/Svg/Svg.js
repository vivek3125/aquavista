import React from 'react'
import classes from './Svg.module.css';

const Svg = () => {
  return (
    <div>
        <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Calque_1"
                x="0px"
                y="0px"
                viewBox="0 0 1300 350"
                style={{ enableBackground: 'new 0 0 1300 350', border: '1px solid yellow' }}
                xmlSpace="preserve"
            >
                <style type="text/css">
                    {`.st1 {
                        opacity: 0.6;
                        fill: #DB1A5A;
                        enable-background: new;
                    }`}
                </style>
                <path
                    className="st1"
                    d="M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250">
                    <animate
                        attributeName="d"
                        dur="5s"
                        begin="1s"
                        values="M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250;
                                M 0 250 C 600 100 650 450 1300 250 L 1300 550 L 0 550 L 0 250;
                                M 0 250 C 600 450 650 100 1300 250 L 1300 550 L 0 550 L 0 250"
                        repeatCount="indefinite"
                    />
                </path>
                {/* Add other paths with animations here */}
            </svg>
    </div>
  )
}

export default Svg
