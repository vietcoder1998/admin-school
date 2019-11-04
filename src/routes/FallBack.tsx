import React from 'react'
import { Icon } from 'antd'

export default function FallBack(props) {
    return (
        <div
            className="none-footer"
        >
            <div className="fallback-content test">
                <h4 className=' a_c'>
                    Trang wed đang được tải , vui lòng chờ
                                </h4>
                <div className='msg-noti a_c'>
                    <p className=' a_c'>
                        Đang tải thông tin
                                    </p>
                    <p className="icon-noti">
                        <Icon
                            type="loading"
                        />
                    </p>
                </div>
            </div>
        </div>
    )
}