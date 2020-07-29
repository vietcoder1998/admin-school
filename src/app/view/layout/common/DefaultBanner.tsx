import React from 'react';
//@ts-ignore
import WorksvnBanner from "./../../../../assets/image/worksvn-banner.jpg";

export default function DefaultBanner() {
    return <div
        style={{
            width: '100%',
            textAlign: 'center',
            padding: 'calc(50vh - 206px) 20px'
        }}>
        <img alt="worksvn banner" src={WorksvnBanner} />
    </div>
}