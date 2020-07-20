import React, { Component } from 'react'
import { Divider, Button, Input, Select, Tabs, message, Result } from 'antd';
import { connect } from 'react-redux';
import './EventJobsCreate.scss';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { REDUX_SAGA } from '../../../../../const/actions';
import { TYPE } from '../../../../../const/type';
import { IAppState } from '../../../../../redux/store/reducer';
import { IJobName } from '../../../../../models/job-names';
import { IEmBranch } from '../../../../../models/em-branches';
import findIdWithValue from '../../../../../utils/findIdWithValue';
import { _requestToServer } from '../../../../../services/exec';
import { POST, PUT } from '../../../../../const/method';
import { PENDING_JOBS, EVENT_SCHOOLS } from '../../../../../services/api/private.api';
import { routeLink, routePath } from '../../../../../const/break-cumb';
import { NotUpdate } from './../../../layout/common/Common';
import { Required } from '../../../layout/common/Common';
import ShiftContent from '../../../layout/annou-shift/AnnouShift';
import { newShift } from './../../../layout/annou-shift/AnnouShift';
import { IAnnoucementBody } from '../../../../../models/pending-jobs';
import { IShift } from '../../../../../models/apply-cans';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface IState {
    title: string;
    announcementTypeID: string;
    typeMng: Array<any>;
    listItem: Array<{ label: string, value: string }>,
    loading: boolean;
    valueAnnou: string;
    typeCpn: string;
    listEmBranches: Array<IEmBranch>;
    id?: string;
    jobName?: string;
    address?: string;
    skills?: Array<string>
    notComplete?: boolean;
    eventJobDetail?: any;
    body?: IAnnoucementBody;
    eid?: string;
};

interface IProps extends StateProps, DispatchProps {
    match: any;
    history: any;
    getEventJobDetail: Function;
    getListEmBranches: Function;
    getPendingJobDetail: Function;
    getEventJobService?: Function;
};

class EventJobCreate extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            announcementTypeID: "",
            typeMng: [],
            listItem: [],
            loading: false,
            valueAnnou: "",
            typeCpn: TYPE.CREATE,
            listEmBranches: [],
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
                        minSalary: 0,
                        maxSalary: 0,
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
        const { id, eid } = this.state;
        this.props.getListEmBranches();
        this.props.getEventJobDetail(id, eid);
    };

    static getDerivedStateFromProps(props?: IProps, state?: IState) {
        if (props.match.params.id && props.match.params.id !== state.id) {
            let id = props.match.params.id;
            let url_string = window.location.href;
            let url = new URL(url_string);
            let eid = url.searchParams.get("eid");


            if (
                props.match.url.includes("fix") ||
                props.match.url.includes("copy")
            ) {
                console.log("map");
                props.getEventJobDetail(id, eid);
            }

            if (
                props.match.url.includes("pending")
            ) {
                props.getPendingJobDetail(id);
            }

            return {
                id
            }
        }

        if (
            (props.eventJobDetail ||
                props.pendingJobDetail) && props.match.params.id
        ) {
            let typeCpn = TYPE.CREATE;
            let eventJobDetail = null;
            let jobID = null;
            let body = state.body;
            let id = state.body.id;
            let requiredSkillIDs = [];

            if (props.match.url.includes("pending")) {
                typeCpn = TYPE.PENDING;
                id = props.pendingJobDetail.id;
                eventJobDetail = props.pendingJobDetail.data;
                jobID = eventJobDetail.jobNameID;
                requiredSkillIDs = eventJobDetail.requiredSkillIDs
            };

            if (props.match.url.includes("fix")) {
                typeCpn = TYPE.FIX;
                id = props.eventJobDetail.id;
                eventJobDetail = props.eventJobDetail;
                jobID = eventJobDetail.jobName && eventJobDetail.jobName.id;
                requiredSkillIDs = eventJobDetail.requiredSkills && eventJobDetail.requiredSkills.length &&
                    eventJobDetail.requiredSkills.map((item: any) => item.id)
            };

            if (props.match.url.includes("copy")) {
                typeCpn = TYPE.COPY;
                id = props.eventJobDetail.id;
                eventJobDetail = props.eventJobDetail;
                jobID = eventJobDetail.jobName && eventJobDetail.jobName.id;
                requiredSkillIDs = eventJobDetail.requiredSkills && eventJobDetail.requiredSkills.length &&
                    eventJobDetail.requiredSkills.map((item: any) => item.id)
            };

            if (typeCpn !== TYPE.CREATE) {
                if (eventJobDetail) {
                    body.id = id;
                    body.description = eventJobDetail.description;
                    body.jobTitle = eventJobDetail.jobTitle;
                    body.jobNameID = jobID;
                    body.jobType = eventJobDetail.jobType;
                    body.employerBranchID = eventJobDetail.employerBranchID;
                    body.description = eventJobDetail.description;
                    body.expirationDate = eventJobDetail.expirationDate;
                    body.shifts = eventJobDetail.shifts;
                    body.requiredSkillIDs = requiredSkillIDs
                };
            };

            return {
                body,
                typeCpn,
                eventJobDetail
            }
        }

        return null
    }

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

    removeShift = (index: number) => {
        let { body } = this.state;
        body.shifts.splice(index, 1);
        message.info({ type: "info", message: `Đã xóa ca số :${index}` });
        this.setState({ body });
    };

    createRequest = async () => {
        let { body, typeCpn, id } = this.state;
        let url_string = window.location.href;
        let url = new URL(url_string);
        let eid = url.searchParams.get("eid");

        let newBody = await this.pretreatmentBody(body, typeCpn);
        let matching = (typeCpn === TYPE.CREATE || typeCpn === TYPE.COPY) ? `/${eid}/jobs` : `/${eid}/jobs/${id}`;
        let METHOD = (typeCpn === TYPE.CREATE || typeCpn === TYPE.COPY) ? POST : PUT;
        let API = typeCpn === TYPE.PENDING ? PENDING_JOBS : EVENT_SCHOOLS;

        await this.setState({ loading: true });
        await _requestToServer(
            METHOD,
            API + matching,
            newBody,
            null,
            undefined,
            undefined,
            true,
            false,
        ).then((res: any) => {
            if (res) {
                setTimeout(() => {
                    this.props.history.push(routeLink.EVENT + routePath.JOBS + routePath.LIST + `?eid=${eid}`);
                }, 500);
            }
        }).finally(() => {
            this.setState({ loading: false })
        })
    }

    pretreatmentBody = (body: IAnnoucementBody, typeCpn: string) => {
        let newBody = body;
        this.setState({ notComplete: false });

        newBody.shifts.forEach((element: any, index: number) => {
            if (!element.genderRequireds || element.genderRequireds.length === 0) {
                message.warning(`Ca cần thêm số lượng tuyển`);
                this.setState({ notComplete: true })
            } else {
                element.genderRequireds = element.genderRequireds.map((item: any, index: number) => {
                    if (item.id && typeCpn !== TYPE.CREATE) {
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
            }
        });

        if (typeCpn !== TYPE.FIX || typeCpn !== TYPE.PENDING) {
            newBody.shifts.forEach((element: IShift, index: number) => {
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


        return { ...newBody, id: undefined };
    }

    render() {
        let {
            typeCpn,
            body,
            loading,
            eid
        } = this.state;

        let {
            listJobNames,
            listEmBranches,
            listSkills,
            eventJobDetail,
        } = this.props;

        let ct_btn_ex = "Huỷ";
        let ct_btn_nt = "Lưu lại";

        switch (typeCpn) {
            case TYPE.COPY:
                ct_btn_ex = "Huỷ tạo";
                ct_btn_nt = "Tạo mới(bản sao)";
                break;

            case TYPE.FIX:
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

        let list_job_name_options = listJobNames.map((item: IJobName) => ({ label: item.name, value: item.id }));
        let listEmBranches_options = listEmBranches.map((item: any) => ({ label: item.branchName, value: item.id }));
        let list_skill_options = listSkills.map((item: IJobName, index: number) => (<Option key={index} value={item.name} children={item.name} />));

        if (
            !eventJobDetail && eventJobDetail.id
        ) {
            return <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
            />
        }

        let color = "black";
        if (!body.description) {
            color = "black";
        } else {
            if (body.description.length < 4000) {
                color = "#168ECD"
            }

            if (4000 < body.description.length && body.description.length < 6000) {
                color = "orange"
            }

            if (6000 < body.description.length && body.description.length < 10000) {
                color = "red"
            }
        }

        return (
            <div className='common-content'>

                <Divider orientation="left" >Nội dung bài đăng</Divider>
                <div className="announcements-create-content">
                    <InputTitle
                        type={TYPE.INPUT}
                        title={"Tiêu đề"}
                        widthLabel="150px"
                    >
                        <TextArea
                            style={{ width: '100%' }}
                            maxLength={400}
                            placeholder="ex: Tuyển nhân viên bán hàng (tối đa 400 kí tự)"
                            value={body.jobTitle}
                            onChange={
                                (event: any) => {
                                    body.jobTitle = event.target.value;
                                    this.setState({ body });
                                }
                            }
                        />
                    </InputTitle>
                    <InputTitle
                        title="Nội dung bài đăng"
                        widthLabel="150px"
                        widthComponent="400px"
                    >
                        <TextArea
                            rows={15}
                            style={{ width: '100%' }}
                            maxLength={10000}
                            placeholder="ex: Yêu cầu: giao tiếp tiếng Anh tốt (tối đa 10000 kí tự)"
                            value={body.description}
                            onChange={
                                (event: any) => {
                                    body.description = event.target.value;
                                    this.setState({ body });
                                }
                            }
                        />
                    </InputTitle>
                    <p className='a_c'>
                        <NotUpdate children={
                            <label> Hiện tại: <span style={{ color }}> {body.description ? body.description.length : 0}</span> kí tự</label>}
                        />
                    </p>
                    <InputTitle
                        title="Chọn công việc"
                        type={TYPE.SELECT}
                        listValue={list_job_name_options}
                        value={findIdWithValue(listJobNames, body.jobNameID, "id", "name")}
                        onChange={
                            (event: any) => {
                                body.jobNameID = event;
                                this.setState({ body });
                            }
                        }
                        widthLabel="150px"
                        widthSelect="100%"
                        placeholder="ex: Nhân viên văn phòng"
                    />
                    <InputTitle
                        title="Chọn chi nhánh "
                        type={TYPE.SELECT}
                        listValue={listEmBranches_options}
                        value={findIdWithValue(listEmBranches, body.employerBranchID, "id", "branchName")}
                        onChange={
                            (event: any) => {
                                body.employerBranchID = event;
                                this.setState({ body });
                            }
                        }
                        widthLabel="150px"
                        widthSelect="100%"
                        placeholder="ex: Công ty abc"
                    />

                    <InputTitle
                        title="Yêu cầu khác"
                        widthLabel="150px"
                    >
                        <Select
                            mode="multiple"
                            size="default"
                            placeholder="ex: Giao tiếp, Tiếng Anh"
                            value={findIdWithValue(listSkills, body.requiredSkillIDs, "id", "name")}
                            onChange={
                                (event: any) => {
                                    let listData = findIdWithValue(listSkills, event, "name", "id")
                                    body.requiredSkillIDs = listData;
                                    this.setState({ body })
                                }
                            }
                            style={{ width: '100%' }}
                        >
                            {list_skill_options}
                        </Select>
                    </InputTitle>
                </div>
                <Divider orientation="left" >Chọn loại công việc<Required /></Divider>
                <div className="announcements-create-content">
                    <Tabs
                        activeKey={body.jobType}
                        style={{ width: "100%" }}
                        onChange={(event: string) => {
                            body.jobType = event;
                            this.setState({ body });
                            typeCpn === TYPE.CREATE && this.replaceShift();
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
                                            removeShift={(index: number) => this.removeShift(index)}
                                            onChange={(event: IShift) => this.handleBodyShift(event, index)}
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
                                    <div
                                        key={index}
                                    >
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
                    <div>
                        <NotUpdate warning={true} msg={`(Lưu ý: Ngày thời gian bắt đầu phải lớn hơn thời gian kết thúc, số nhân viên ứng tuyển tối thiểu là 1)`} />
                    </div>
                </div>
                {

                    (eventJobDetail.acceptedApplied === 0 &&
                        eventJobDetail.pendingApplied === 0 &&
                        eventJobDetail.rejectedApplied === 0) ||
                        (typeCpn !== TYPE.FIX) ?
                        <div className="Announcements-create-content">
                            <Button
                                type="primary"
                                icon={loading ? 'loading' : "check"}
                                style={{
                                    margin: "10px 10px",
                                    float: "right"
                                }}
                                onClick={() => this.createRequest()}
                            >
                                {ct_btn_nt}
                            </Button>
                            <Button
                                type="danger"
                                icon={'close'}
                                style={{
                                    margin: "10px 10px",
                                    float: "right"
                                }}
                                onClick={
                                    () =>
                                        this.props.history.push(
                                            routeLink.EVENT +
                                            routePath.JOBS +
                                            routePath.LIST + `?id=${eid}`)
                                }
                            >
                                {ct_btn_ex}
                            </Button>
                        </div> :
                        <NotUpdate
                            msg={`Bài đăng có đã có người đăng tuyển hoặc đã hết hạn`}
                        />
                }
            </div >
        )
    };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getEventJobDetail: (id?: string, schoolEventID?: string) => dispatch({ type: REDUX_SAGA.EVENT_SCHOOLS.GET_EVENT_JOB_DETAIL, id, schoolEventID }),
    getPendingJobDetail: (id?: string) => dispatch({ type: REDUX_SAGA.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL, id }),
    getListEmBranches: () => dispatch({ type: REDUX_SAGA.EM_BRANCHES.GET_EM_BRANCHES }),
    getEventJobService: (id?: string) => dispatch({ type: REDUX_SAGA.EVENT_SCHOOLS.GET_EVENT_JOB_SERVICE, id })
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    listJobNames: state.JobNames.items,
    eventJobDetail: state.EventJobDetail,
    pendingJobDetail: state.PendingJobDetail,
    listSkills: state.Skills.items,
    listEmBranches: state.EmBranches.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EventJobCreate)