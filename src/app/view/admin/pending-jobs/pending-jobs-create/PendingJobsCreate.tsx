import React, { Component } from 'react'
import { Icon, Divider, Row, Col, Button, Input, DatePicker, Select, Tabs, message, Result } from 'antd';
import { connect } from 'react-redux';
import './PendingJobsCreate.scss';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { REDUX_SAGA } from '../../../../../common/const/actions';
import { TYPE } from '../../../../../common/const/type';
import { IAppState } from '../../../../../redux/store/reducer';
import { findIdWithValue } from '../../../../../common/utils/findIdWithValue';
import { _requestToServer } from '../../../../../services/exec';
import { POST, PUT } from '../../../../../common/const/method';
import { PENDING_JOBS } from '../../../../../services/api/private.api';
import { EMPLOYER_HOST } from '../../../../environment/dev';
import moment from 'moment';
import { IShifts } from '../../../../../redux/models/pending-job';
import ShiftContent from '../../../layout/annou-shift/AnnouShift';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface IPendingJobsCreateState {
    title: string;
    announcementTypeID: string;
    type_management: Array<any>;
    list_item: Array<{ label: string, value: string }>,
    loading: boolean;
    value_annou: string;
    type_cpn: string;
    list_em_branches: Array<IEmBranch>;
    body: IAnnoucementBody;
    id?: string;
    jobName?: string;
    address?: string;
    skills?: Array<string>
};

interface IPendingJobsCreateProps extends StateProps, DispatchProps {
    match: any;
    history: any;
    getPendingsJobDetail: Function;
    getListEmBranches: Function;
};

const getBody = () => {
    return {
        id: null,
        jobTitle: null,
        jobNameID: null,
        employerBranchID: null,
        description: null,
        requiredSkillIDs: [],
        jobType: TYPE.FULLTIME,
        expirationDate: null,
        shifts: []
    }
}

class PendingJobsCreate extends Component<IPendingJobsCreateProps, IPendingJobsCreateState> {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            announcementTypeID: "",
            type_management: [],
            list_item: [],
            loading: false,
            value_annou: "",
            type_cpn: TYPE.CREATE,
            list_em_branches: [],
            body: {
                jobTitle: null,
                jobNameID: null,
                employerBranchID: null,
                description: null,
                requiredSkillIDs: [],
                jobType: null,
                expirationDate: null,
                shifts: [
                    {
                        startTime: "00:00",
                        endTime: "00:00",
                        minSalary: null,
                        maxSalary: null,
                        unit: 'ca',
                        mon: false,
                        tue: false,
                        wed: false,
                        thu: false,
                        fri: false,
                        sat: false,
                        sun: false,
                        genderRequireds: null
                    },
                ]
            },
            id: null,
        };
    };

    async componentDidMount() {
        if (this.props.match.params.id) {
            let id = this.props.match.params.id;
            await this.props.getPendingsJobDetail(id);
        };

        this.props.getListEmBranches();
    };

    static getDerivedStateFromProps(props: any, state: IPendingJobsCreateState) {
        if (
            props.pending_job_detail &&
            props.match.params.id &&
            props.match.params.id !== state.body.id
        ) {
            let type_cpn = TYPE.CREATE;
            if (props.match.url.includes("fix")) {
                type_cpn = TYPE.EDIT;
            };
            if (props.match.url.includes("copy")) {
                type_cpn = TYPE.COPY;
            };

            let pending_job_detail = props.pending_job_detail;
            let body = getBody();
            body.id = pending_job_detail.id
            body.description = pending_job_detail.description;
            body.jobTitle = pending_job_detail.jobTitle;
            body.jobNameID = pending_job_detail.jobName.id;
            body.jobType = pending_job_detail.jobType;
            body.employerBranchID = pending_job_detail.employerBranchID;
            body.description = pending_job_detail.description;
            body.expirationDate = pending_job_detail.expirationDate;
            body.shifts = pending_job_detail.shifts;
            body.requiredSkillIDs = pending_job_detail.requiredSkills.length && pending_job_detail.requiredSkills.map((item: any) => { return item.id })
            return {
                body,
                type_cpn,
                id: props.match.params.id
            }
        }
        return null
    }

    onChangeValue = (event: any, param: string) => {
        let { body } = this.state;
        let value: any = event;
        switch (param) {
            case value:

                break;
        };
        body[param] = value;
        this.setState({ body });
    };

    handleBodyShift = (event: any, index: number | string) => {
        let { body } = this.state;
        body.shifts[index] = event;
        this.setState({ body })
    };

    replaceShift = () => {
        let { body } = this.state;
        body.shifts = [];
        body.shifts.push(newShift());
        this.setState({ body })
    };

    addShift = () => {
        let { body } = this.state;
        body.shifts.push(newShift());
        this.setState({ body });
    };

    removeShift = (id: number | string) => {
        let { body } = this.state;
        if (body.shifts.length > 1) {
            body.shifts.forEach((item: IShifts, index: number) => {
                if (item.id === id) {
                    body.shifts.splice(index, 1);
                    message.info({ type: "info", message: `Đã xóa ca số :${index}` })
                };
            });
        };

        this.setState({ body });
    };

    createRequest = async () => {
        let { body, type_cpn, id } = this.state;
        let newBody = this.pretreatmentBody(body, type_cpn);
        let matching = type_cpn === TYPE.EDIT ? `/${id}` : ``;
        let METHOD = type_cpn === TYPE.EDIT ? PUT : POST;

        await _requestToServer(
            METHOD,
            JOB_ANNOUNCEMENTS + matching,
            newBody,
            null,
            undefined,
            EMPLOYER_HOST,
            true,
            false,
        ).then((res: any) => {
            this.props.history.push('/v1/admin/jobs/job-announcements/list');
        })
    }

    pretreatmentBody = (body: IAnnoucementBody, type_cpn: string) => {
        let newBody = body;
        newBody.shifts.forEach((element: any, index: number) => {
            element.genderRequireds = element.genderRequireds.map((item: any, index: number) => {
                if (item.id && type_cpn === TYPE.EDIT) {
                    return {
                        id: item.id,
                        quantity: item.quantity,
                        gender: item.gender,
                    }
                } else {
                    return {
                        quantity: item.quantity,
                        gender: item.gender,
                    }
                }
            });

            element.genderRequireds = element.genderRequireds.filter(
                (item: any, index: number) => item.quantity && item.quantity !== 0
            );
        });

        if (type_cpn !== TYPE.EDIT) {
            newBody.shifts.forEach((element: IShifts, index: number) => {
                if (element.id) {
                    delete element["id"]
                }

                if (element.minSalary === null) {
                    element.minSalary = 0;
                }

                if (element.maxSalary === null) {
                    element.maxSalary = 0;
                }
            })
        }

        delete newBody["id"];
        return newBody;
    }

    render() {
        let {
            type_cpn,
            body,
        } = this.state;

        let {
            list_job_names,
            list_em_branches,
            list_skills,
            pending_job_detail
        } = this.props;

        let ct_btn_ex = "Huỷ";
        let ct_btn_nt = "Lưu lại";

        switch (type_cpn) {
            case TYPE.COPY:
                ct_btn_ex = "Huỷ tạo";
                ct_btn_nt = "Tạo mới(bản sao)";
                break;

            case TYPE.EDIT:
                ct_btn_ex = "Huỷ";
                ct_btn_nt = "Lưu lại";
                break;
            case TYPE.CREATE:
                ct_btn_ex = "Huỷ tạo";
                ct_btn_nt = "Tạo mới";
                break;
            default:
                break;
        };

        let list_job_name_options = list_job_names.map((item: IJobName) => ({ label: item.name, value: item.id }));
        let list_em_branches_options = list_em_branches.map((item: any) => ({ label: item.branchName, value: item.id }));
        let list_skill_options = list_skills.map((item: IJobName, index: number) => (<Option key={index} value={item.name} children={item.name} />));

        if (
            type_cpn === TYPE.EDIT &&( !pending_job_detail || !pending_job_detail.id)
        ) {
            return <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
            />
        }

        return (
            <div className='common-content'>
                <h5>
                   {type_cpn === TYPE.EDIT ? "Thông tin bài viết(sửa)": "Tạo bài viết mới"}  
                </h5>
                <Row>
                    <Col xs={0} sm={1} md={2} lg={3} xl={3} xxl={4}></Col>
                    <Col xs={0} sm={22} md={20} lg={18} xl={18} xxl={16}>
                        <Divider orientation="left" >Nội dung bài viết</Divider>
                        <div className="announcements-create-content">
                            <InputTitle
                                type={TYPE.INPUT}
                                title="Tiêu đề"
                                widthLabel="200px"
                                children={
                                    <Input
                                        style={{ width: 550 }}
                                        type="text"
                                        maxLength={260}
                                        placeholder="ex: Tuyển nhân viên bán hàng"
                                        value={body.jobTitle}
                                        onChange={
                                            (event: any) => {
                                                body.jobTitle = event.target.value;
                                                this.setState({ body });
                                            }
                                        }
                                    />
                                }
                            />
                            <InputTitle
                                title="Nội dung bài đăng"
                                widthLabel="200px"
                                widthComponent="400px"
                            >
                                <TextArea
                                    rows={5}
                                    style={{ width: 550 }}
                                    maxLength={260}
                                    placeholder="ex: Yêu cầu: giao tiếp tiếng Anh tốt"
                                    value={body.description}
                                    onChange={
                                        (event: any) => {
                                            body.description = event.target.value;
                                            this.setState({ body });
                                        }
                                    }
                                />
                            </InputTitle>
                            <InputTitle
                                title="Chọn thời gian hết hạn"
                                type="SWITCH"
                                widthLabel="200px"
                            >
                                <DatePicker
                                    format={"DD/MM/YYYY"}
                                    style={{ width: 550 }}
                                    placeholder="ex: 07/12/2019"
                                    value={body.expirationDate ? moment(body.expirationDate) : null}
                                    onChange={
                                        (event?: any) => {
                                            event ? body.expirationDate = event.unix() * 1000 : body.expirationDate = null;
                                            this.setState({ body });
                                        }
                                    }
                                />
                            </InputTitle>
                            <InputTitle
                                title="Chọn công việc"
                                type={TYPE.SELECT}
                                list_value={list_job_name_options}
                                value={findIdWithValue(list_job_names, body.jobNameID, "id", "name")}
                                onChange={
                                    (event: any) => {
                                        body.jobNameID = event;
                                        this.setState({ body });
                                    }
                                }
                                widthLabel="200px"
                                widthSelect="550px"
                                placeholder="ex: Nhân viên văn phòng"
                            />
                            <InputTitle
                                title="Chọn địa chỉ đăng tuyển"
                                type={TYPE.SELECT}
                                list_value={list_em_branches_options}
                                value={findIdWithValue(list_em_branches, body.employerBranchID, "id", "branchName")}
                                onChange={
                                    (event: any) => {
                                        body.employerBranchID = event;
                                        this.setState({ body });
                                    }
                                }
                                widthLabel="200px"
                                widthSelect="550px"
                                placeholder="ex: Công ti abc"
                            />

                            <InputTitle
                                title="Chọn loại kĩ năng"
                                widthLabel="200px"
                            >
                                <Select
                                    mode="multiple"
                                    size="default"
                                    placeholder="ex: Giao tiếp, Tiếng Anh"
                                    value={findIdWithValue(list_skills, body.requiredSkillIDs, "id", "name")}
                                    onChange={
                                        (event: any) => {
                                            let list_data = findIdWithValue(list_skills, event, "name", "id")
                                            body.requiredSkillIDs = list_data;
                                            this.setState({ body })
                                        }
                                    }
                                    style={{ width: 550 }}
                                >
                                    {list_skill_options}
                                </Select>
                            </InputTitle>
                        </div>
                        <Divider orientation="left" >Thời gian làm việc</Divider>
                        <div className="announcements-create-content">
                            <Tabs
                                activeKey={body.jobType}
                                style={{ width: "100%" }}
                                onChange={(event: string) => {
                                    body.jobType = event;
                                    this.setState({ body });
                                    type_cpn === TYPE.CREATE && this.replaceShift();
                                }}
                            >
                                <TabPane tab="Toàn thời gian" key={TYPE.FULLTIME}>
                                    {body.shifts &&
                                        body.shifts.length > 0 &&
                                        body.shifts.map((item: any, index: number) => (
                                            <div key={index}>
                                                <ShiftContent
                                                    shifts={item}
                                                    type={TYPE.FULLTIME}
                                                    removeButton={false}
                                                    id={item.id}
                                                    onChange={(event) => this.handleBodyShift(event, index)}
                                                />
                                            </div>

                                        ))
                                    }
                                </TabPane>
                                <TabPane tab="Bán thời gian" key={TYPE.PARTTIME}>
                                    {body.shifts &&
                                        body.shifts.length > 0 &&
                                        body.shifts.map((item: any, index: number) => (
                                            <div key={index}>
                                                <ShiftContent
                                                    shifts={item}
                                                    index={index}
                                                    type={TYPE.PARTTIME}
                                                    id={item.id}
                                                    removeButton={true}
                                                    removeShift={(id: number | string) => this.removeShift(id)}
                                                    onChange={(event: IShifts) => this.handleBodyShift(event, index)}
                                                />
                                            </div>
                                        ))
                                    }
                                    <Button type="primary" icon="plus" onClick={() => this.addShift()} >Thêm ca</Button>
                                </TabPane>
                                <TabPane tab="Thực tập sinh" key={TYPE.INTERNSHIP} >
                                    {body.shifts &&
                                        body.shifts.length > 0 &&
                                        body.shifts.map((item: any, index: number) => (
                                            <div key={index}>
                                                < ShiftContent
                                                    shifts={item}
                                                    type={TYPE.INTERNSHIP}
                                                    removeButton={false}
                                                    id={item.id}
                                                    onChange={(event) => this.handleBodyShift(event, index)}
                                                />
                                            </div>

                                        ))
                                    }
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="Announcements-create-content">
                            <Button
                                type="primary"
                                prefix={"check"}
                                style={{
                                    margin: "10px 10px",
                                    float: "right"
                                }}
                                onClick={() => this.createRequest()}
                            >
                                {ct_btn_nt}
                                <Icon type="right" />
                            </Button>
                            <Button
                                type="danger"
                                prefix={"check"}
                                style={{
                                    margin: "10px 10px",
                                    float: "right"
                                }}
                                onClick={() => { this.props.history.push('/v1/admin/jobs/job-announcements/list') }}
                            >
                                <Icon type="close" />
                                {ct_btn_ex}
                            </Button>
                        </div>
                    </Col>
                    <Col xs={0} sm={1} md={2} lg={3} xl={3} xxl={4}></Col>
                </Row>
            </div >
        )
    };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getPendingsJobDetail: (id) => dispatch({ type: REDUX_SAGA.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL, id }),
    getListEmBranches: () => dispatch({ type: REDUX_SAGA.EM_BRANCHES.GET_EM_BRANCHES }),
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    list_job_names: state.JobNames.items,
    pending_job_detail: state.PendingsJobDetail,
    list_skills: state.Skills.items,
    list_em_branches: state.EmBranches.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PendingJobsCreate)