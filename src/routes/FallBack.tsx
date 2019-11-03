import React from 'react'
import { Row, Col, Icon } from 'antd'


export default function FallBack(props) {
    return (
        <div
            className="none-footer"
        >
            <Row>
                <Col xs={0} sm={4} md={8} lg={8} xl={9}></Col>
                <Col xs={24} sm={16} md={8} lg={8} xl={6} >
                    <div className="FallBack-content test">
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
                        <p className='a_c'>
                        </p> */}
                            </div>
                </Col>
                <Col xs={0} sm={4} md={8} lg={8} xl={9}></Col>
            </Row>
        </div>
    )
}