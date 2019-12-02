import React from 'react'
import { Icon } from 'antd';
// @ts-ignore
// import CatGif from './../../../../assets/image/cat-chocolate.gif';
import CatGif from './../../../../assets/image/rainbow-cat-gif-7.gif';


export default function Loading(props: any) {
    return (
        <div
            className="fallback-content test"
            style={{
                width: "100%",
                height: "100%",
                paddingTop: "20vh",

            }}
        >
            <h4 className='a_c'
            // style={{ color: "white" }}
            >
                Đang tải trang
                </h4>
            <div className=' a_c'>
                <p className=' a_c'>
                    <Icon type="loading-3-quarters" style={{ color: "blue", padding: "5px" }} spin />
                    loaddddddddddddding...
                    </p>
                <img src={CatGif}
                    style={{
                        width: 400,
                        height: 200,
                    }}
                    alt="gif"
                />
            </div>
        </div>
    )
}