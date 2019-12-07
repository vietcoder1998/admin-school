import React from 'react';
import { Row, Col, Result } from 'antd';

export default function NotFound (props: any) {
    return (
        <div className='not-found'>
            <Row>
                <Col xs={0} sm={0} md={2} lg={3} xxl={5}></Col>
                <Col xs={24} sm={24} md={20} lg={18} xxl={14}>
                    <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the page you visited does not exist."
                    />
                </Col>
                <Col xs={0} sm={0} md={2} lg={3} xxl={5}></Col>
            </Row>
        </div>
    );
}
