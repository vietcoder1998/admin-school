import React from 'react'
import {Icon} from 'antd'

export default function FallBack(props: any) {
    return (
        <div
            className="none-footer"
        >
            <div className="fallback-content test">
                <h4 className='a_c'>
                    Đang tải nội dung
                </h4>
                <div className='msg-noti a_c'>
                    <p className=' a_c'>
                        Đang tải nội dung
                    </p>
                    <p className="icon-noti">
                        <Icon type="loading"/>
                    </p>
                </div>
            </div>
        </div>
    )
}