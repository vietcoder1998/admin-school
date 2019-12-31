import React from 'react'
import { Icon, Avatar, Row, Col, Tabs, Card, Divider, Button } from 'antd';
import './StudentInfo.scss';
// @ts-ignore
import backGround from '../../../../assets/image/base-image.jpg';
// @ts-ignore
import avatar from '../../../../assets/image/test_avatar.jpg';
import { NotUpdate, IptLetter } from '../common/Common';
import IStudentDetail, { ILanguageSkillStudent, IExperienceStudent } from '../../../../models/student-detail';
import { ISkill } from '../../../../models/candidates-detail';
import { timeConverter } from '../../../../utils/convertTime';

const { TabPane } = Tabs;
const { Meta } = Card;

interface IStudentInfoProps {
    data?: IStudentDetail,
    loading?: boolean,
    onClickButton?: () => any
};

function StudentInfo(props: IStudentInfoProps) {
    let { data, loading } = props;
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
                            {data ? (data.lastName + " " + data.firstName) : <NotUpdate />}
                        </div>
                        <Icon
                            type="safety-certificate"
                            theme="filled"
                            style={{
                                color:
                                    data &&
                                        data.profileVerified ? 'greenyellow' : 'red'
                            }}
                        />
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
                                        description={data && data.school ? data.school.name : <NotUpdate />}
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
                                        description={data && data.school && data.school.schoolType ? data.school.schoolType.name : <NotUpdate />}
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
                                        description={data && data.major ? data.major.name : <NotUpdate />}
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
                                <Card title="Trình độ ngoại ngữ" bordered={false}>
                                    {data && data.languageSkills && data.languageSkills.length > 0 ? data.languageSkills.map((item?: ILanguageSkillStudent, i?: number) =>
                                        <div key={i}>
                                            <div><IptLetter value="Ngôn ngữ: " />{item.language.name}</div>
                                            <div><IptLetter value="Trình độ: " />{item.level}</div>
                                            <div><IptLetter value="Chứng chỉ: " />{item.certificate}</div>
                                            <div><IptLetter value="Điểm số: " />{item.score}</div>
                                            <Divider />
                                        </div>) : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Kinh nghiệm" bordered={false}>
                                    {data && data.experiences && data.experiences.length > 0 ? data.experiences.map((item?: IExperienceStudent, i?: number) =>
                                        <div key={i}>
                                            <div><IptLetter value="Tên công việc: " /> {item.jobName}</div>
                                            <div><IptLetter value="Công ti: " />{item.companyName}</div>
                                            <div><IptLetter value="Ngày bắt đầu: " />{item.startedDate !== -1 ? timeConverter(item.startedDate, 1000) : <NotUpdate />}</div>
                                            <div><IptLetter value="Ngày kết thúc: " />{item.finishedDate !== -1 ? timeConverter(item.finishedDate, 1000) : <NotUpdate />}</div>
                                            <div><IptLetter value="Mô tả thêm: " />{item.description}</div>
                                            <Divider />
                                        </div>) : <NotUpdate />}
                                </Card>
                            </Col>
                            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                                <Card title="Yêu cầu khác" bordered={false}>
                                    <div>
                                        {data && data.skills && data.skills.length > 0 ? data.skills.map((item?: ISkill, i?: number) =>
                                            <span className='item-more-info' key={i}>{item.name}</span>
                                        ) : <NotUpdate />}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
            <div className='bottom-info'>
                <Button
                    icon={loading ? 'loading' : (data && data.profileVerified ? "dislike" : "like")}
                    type={data && data.profileVerified ? "danger" : "primary"}
                    style={{ float: "right" }}
                    children={data && data.profileVerified ? "Hủy xác thực" : "Xác thực"}
                    onClick={props && props.onClickButton ? () => props.onClickButton() : undefined}
                />
            </div>
        </div >
    )
}


export default (StudentInfo)
