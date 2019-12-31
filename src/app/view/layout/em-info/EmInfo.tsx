import React from 'react'
import { Icon, Avatar, Row, Col, Tabs, Card, Divider, Skeleton } from 'antd';
import './EmInfo.scss';
// @ts-ignore
import backGround from '../../../../assets/image/base-image.jpg';
// @ts-ignore
import avatar from '../../../../assets/image/test_avatar.jpg';
import { NotUpdate, IptLetterP } from '../common/Common';
import { IEmControllerDetail } from '../../../../models/em-controller-detail';

const { TabPane } = Tabs;
const { Meta } = Card;

interface IEmployerInfoProps {
    data?: IEmControllerDetail,
};

function EmployerInfo(props: IEmployerInfoProps) {
    let { data } = props;

    // Error loading 
    let [onErrLogo, setErrLogo] = React.useState(false);
    let [onErrCover, setErrCover] = React.useState(false);

    return (
        <div className="employer-info">
            <div className="employer-info-header                                                                test">
                {/* LogoUrl */}
                <img
                    className="cover-image-profile "
                    src={!onErrCover && data && data.coverUrl ? data.coverUrl : backGround}
                    alt={"base"}
                    onError={() => setErrCover(true)}
                />
                <div className="block-image">
                    <div
                        className="content-avatar"
                    >
                        <Avatar
                            // @ts-ignore
                            src={!onErrLogo && data && data.logoUrl ? data.logoUrl : avatar}
                            style={{
                                height: "8vw",
                                width: "8vw",
                                fontSize: 60,
                                border: 'solid #168ECD 3px',
                                zIndex: 1
                            }}
                            // @ts-ignore
                            onError={() => setErrLogo(true)}
                        />
                        <div
                            style={{
                                width: '100%',
                                height: '50%',
                                position: 'absolute',
                                bottom: -1,
                                zIndex: 0,
                                backgroundColor: '#ffffff'
                            }}
                        />
                    </div>
                    <div className={'name-employer'}>
                        <div>
                            {data && data.employerName ? data.employerName : <NotUpdate />}
                        </div>
                        <Icon
                            type="safety-certificate"
                            theme="filled"
                            style={{
                                color: props &&
                                    props.data &&
                                    props.data.profileVerified ? 'greenyellow' : 'red'
                            }}
                        />
                    </div>
                </div>
            </div>
            <Divider />
            <div className="employer-info-body">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Giới thiệu" key="1">
                        <Row>
                            <Col sm={24} md={12} lg={12} xl={12} xxl={8}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type='profile' />
                                        }
                                        title="Tên nhà tuyển dụng"
                                        description={
                                            props &&
                                                props.data &&
                                                props.data.employerName ?
                                                props.data.employerName :
                                                <NotUpdate />
                                        }
                                    />
                                </Card>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12} xxl={8}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type='mail' />
                                        }
                                        title="Thư điện tử"
                                        description={props && props.data && props.data.email ? props.data.email : <NotUpdate />}
                                    />
                                </Card>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12} xxl={8}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type='phone' />
                                        }
                                        title="Số điện thoại"
                                        description={props && props.data && props.data.phone ? props.data.phone : <NotUpdate />}
                                    />
                                </Card>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12} xxl={8}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type='environment' />
                                        }
                                        title="Địa chỉ"
                                        description={props && props.data && props.data.address ? props.data.address : <NotUpdate />}
                                    />
                                </Card>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12} xxl={8}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type='environment' />
                                        }
                                        title="Mã số thuế"
                                        description={props && props.data && props.data.taxCode ? props.data.taxCode : <NotUpdate />}
                                    />
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type='home' />
                                        }
                                        title="Mô tả sơ lược"
                                        description={props && props.data && props.data.description ? props.data.description : <NotUpdate />}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Ảnh xác minh" key="2">
                        <div className='verified-profile'>
                            <Row>
                                <Col xs={24} md={12} lg={12} xl={12} xxl={24} >
                                    <div className="ic-ct-img">
                                        <IptLetterP value={"Mặt trước giấy phép"} />
                                        <Skeleton avatar loading={data.identityCardBackImageUrl ? false : true} >
                                            <img className='ic' src={data.identityCardFrontImageUrl} alt='front description' />
                                        </Skeleton>
                                    </div>
                                </Col>
                                <Col xs={24} md={12} lg={12} xl={12} xxl={24} >
                                    <div className="ic-ct-img">
                                        <IptLetterP value={"Ảnh văn phòng sau"} />
                                        <Skeleton avatar loading={data.identityCardBackImageUrl ? false : true} >
                                            <img className='ic' src={data.identityCardBackImageUrl} alt='front description' />
                                        </Skeleton>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div >
    )
}

export default (EmployerInfo)
