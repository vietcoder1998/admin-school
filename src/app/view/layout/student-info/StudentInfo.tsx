import React from 'react'
import { Icon, Avatar, Row, Col, Tabs, Card, Divider } from 'antd';
import './StudentInfo.scss';
// @ts-ignore
import backGround from '../../../../assets/image/base-image.jpg';
// @ts-ignore
import avatar from '../../../../assets/image/test_avatar.jpg';
import { NotUpdate, IptLetterP } from '../common/Common';
import IStudentDetail, { ILanguageSkillStudent } from '../../../../redux/models/student-detail';
import { ISkill } from '../../../../redux/models/candidates-detail';

const { TabPane } = Tabs;
const { Meta } = Card;

interface IStudentInfoProps {
    data?: IStudentDetail,
};

function StudentInfo(props: IStudentInfoProps) {
    let { data } = props;

    // Error loading 
    let [onErrLogo, setErrLogo] = React.useState(false);
    let [onErrCover, setErrCover] = React.useState(false);

    return (
        <div className="student-info">
            <div className="student-info-header ">
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
                    <div className={'name-student'}>
                        <div>
                            { data ? (data.lastName + " " + data.firstName)  : <NotUpdate />}
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <div className="student-info-body">
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
                                        description={ data && data.school ? data.school.name  : <NotUpdate />}
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
                                        description={ data && data.school && data.school.schoolType ? data.school.schoolType.name : <NotUpdate />}
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
                                        description={data && data.email ? data.email : <NotUpdate />}
                                    />
                                </Card>
                            </Col>
                            <Col sm={24} md={12} lg={12} xl={12} xxl={8}>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={
                                            <Icon type='global' />
                                        }
                                        title="Chuyên ngành"
                                        description={ data && data.major ? data.major.name : <NotUpdate />}
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
                                <Card title="Kĩ năng" bordered={false}>
                                    {data && data.skills ? data.skills.map((item?: ISkill, i?: number) => <div>
                                        <div>{item.name}</div>
                                    </div>) : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Trình độ ngoại ngữ" bordered={false}>
                                    {data && data.languageSkills ? data.languageSkills.map((item?: ILanguageSkillStudent, i?: number) => <div>
                                        <div>{item.language.name}</div>
                                        <div>{item.level}</div>
                                        <div>{item.certificate}</div>
                                        <div>{item.score}</div>
                                    </div>) : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Kĩ năng" bordered={false}>
                                    {data && data.experiences ? data.experiences.map((item?: ILanguageSkillStudent, i?: number) => <div>
                                        <div>{item.language.name}</div>
                                        <div>{item.level}</div>
                                        <div>{item.certificate}</div>
                                        <div>{item.score}</div>
                                    </div>) : <NotUpdate />}
                                </Card>
                            </Col>
                            {/* <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Đội ngũ giảng viên" bordered={false}>
                                    {data && data.lecturersDesc ? data.lecturersDesc : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Môi trường đào tạo" bordered={false}>
                                    {data && data.achievementDesc ? data.achievementDesc : <NotUpdate />}
                                </Card>
                            </Col> */}
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        </div >
    )
}


export default (StudentInfo)
