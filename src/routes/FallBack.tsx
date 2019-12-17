import React from 'react'
// @ts-ignore
import BarLoading from '../assets/image/cat-chocolate.gif';

export default function FallBack(props) {
    return (
        <div className="fallback-content test"
            style={{
                zIndex: 999,
                width: "100vw",
                height: "100vh",
                position: "fixed",
                textAlign: "center",
                padding: "40vh 0",
                top: 0,
                left: 0,
                backgroundColor: "#fff"
            }}
        >
            <img src={BarLoading} alt='Bar' style={{width: 'auto', height: '10vh'}}/>
        </div>
    )
}