import React from 'react'
import { Icon, Avatar, Row, Col, Tabs, Card, Divider } from 'antd';
import './SchoolInfo.scss';
// @ts-ignore
import backGround from '../../../../assets/image/base-image.jpg';
// @ts-ignore
import avatar from '../../../../assets/image/test_avatar.jpg';
import { NotUpdate, IptLetterP } from '../common/Common';
import { ISchoolDetail } from '../../../../models/school-detail';

const { TabPane } = Tabs;
const { Meta } = Card;

interface ISchoolInfoProps {
    data?: ISchoolDetail,
};

function SchoolInfo(props: ISchoolInfoProps) {
    let { data } = props;

    // Error loading 
    let [onErrLogo, setErrLogo] = React.useState(false);
    let [onErrCover, setErrCover] = React.useState(false);

    return (
        <div className="school-info">
            <div className="school-info-header ">
                {/* LogoUrl */}
                <img
                    className="cover-image-profile"
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
                                border: 'solid white 4px',
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
                    <div className={'name-school'}>
                        <div>
                            {data && data.name ? data.name :     <NotUpdate />}
                        </div>
                        <div>
                            {data && data.shortName ? `(${data.shortName})` : <NotUpdate />}
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="school-info-body">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Giới thiệu" key="1">
                        <Row>
                            <Col sm={24} md={12} lg={12} xl={12} xxl={8}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type='home' />
                                        }
                                        title="Tên trường"
                                        description={props && props.data && props.data.name ? props.data.name : <NotUpdate />}
                                    />
                                </Card>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12} xxl={8}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type="schedule" />
                                        }
                                        title="Loại hình đào tạo"
                                        description={props && props.data && props.data.schoolType && props.data.schoolType.name ? props.data.schoolType.name : <NotUpdate />}
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
                                            <Icon type='global' />
                                        }
                                        title="Trang web "
                                        description={props && props.data && props.data.website ? props.data.website : <NotUpdate />}
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
                        </Row>
                    </TabPane>
                    <TabPane tab="Thông tin chung" key="2">
                        <Row>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Lịch sử phát triển" bordered={false}>
                                    {data && data.historyDesc ? data.historyDesc : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Chiến lược phát triển" bordered={false}>
                                    {data && data.devStrategyDesc ? data.devStrategyDesc : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Thành tích" bordered={false}>
                                    {data && data.studyEnvDesc ? data.studyEnvDesc : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Đội ngũ giảng viên" bordered={false}>
                                    {data && data.lecturersDesc ? data.lecturersDesc : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Môi trường đào tạo" bordered={false}>
                                    {data && data.achievementDesc ? data.achievementDesc : <NotUpdate />}
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="Đào tạo (Sẽ cập nhật sớm)" key="3" disabled>
                        <Row>
                            <Col md={24} lg={14} xl={14} xxl={16}>
                                <div className="description-info">
                                    <IptLetterP value={"Mô tả"} />
                                </div>
                                <div id="abc" className="description-info">
                                    <IptLetterP value={"Thông tin liên hệ"} />
                                </div>
                                <div className="description-info">
                                    <IptLetterP value={"Vị trí trên bản đồ"} />
                                </div>
                            </Col>
                            {/* Front */}
                            <Col md={24} lg={10} xl={10} xxl={8}>
                                <div className="description-info">
                                    <IptLetterP value={"Mặt trước giấy phép kinh doanh"} style={{ marginBottom: 10 }} />
                                </div>
                                {/* Back Image */}
                                <div className="description-info">
                                    <IptLetterP value={"Ảnh văn phòng làm việc"} />
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        </div >
    )
}


export default (SchoolInfo)
