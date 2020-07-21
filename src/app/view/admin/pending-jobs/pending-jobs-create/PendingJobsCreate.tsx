import React, { Component } from 'react'
import { Divider, Button, Input, DatePicker, Select, Tabs, message } from 'antd';
import { connect } from 'react-redux';
import './PendingJobsCreate.scss';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { REDUX_SAGA } from '../../../../../const/actions';
import { TYPE } from '../../../../../const/type';
import { IAppState } from '../../../../../redux/store/reducer';
import findIdWithValue from '../../../../../utils/findIdWithValue';
import { _requestToServer } from '../../../../../services/exec';
import { POST, PUT } from '../../../../../const/method';
import { EM_CONTROLLER } from '../../../../../services/api/private.api';
import moment from 'moment';
import { IShifts, IAnnoucementBody } from '../../../../../models/pending-jobs';
import ShiftContent, { newShift } from '../../../layout/annou-shift/AnnouShift';
import { IJobName } from '../../../../../models/job-type';
import { IEmBranch, IEmBranchesFilter } from '../../../../../models/em-branches';
import { IEmployerFilter, IEmployer } from '../../../../../models/employers';
import { ISkill } from '../../../../../models/skills';

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
    typeCpn: string;
    listEmBranches: Array<IEmBranch>;
    body: IAnnoucementBody;
    id?: string;
    jobName?: string;
    address?: string;
    skills?: Array<string>
    filter_em?: IEmployerFilter,
    employer?: IEmployer,
};

interface IPendingJobsCreateProps extends StateProps, DispatchProps {
    match: any;
    history: any;
    getPendingsJobDetail: Function;
    getListEmBranches: (pageIndex?: number, pageSize?: number, body?: IEmBranchesFilter, id?: any) => any;
    getListEmployers: (pageIndex?: number, pageSize?: number, body?: IEmployerFilter) => any;
};

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
            filter_em: {
                employerName: null,
                taxCode: null,
                regionID: null,
                profileVerified: null,
                ids: null
            },
            employer: {
                id: null,
                employerName: null,
                logoUrl: null,
                profileVerified: null
            },
        };
    };

    async componentDidMount() {
        let { filter_em } = this.state;
        this.props.getListEmployers(0, 10, filter_em);
        this.props.getListEmBranches(0, 0, null, null);
    };

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
        let { body, typeCpn, employer } = this.state;

        if (!body.shifts) {
            message.warning("Bài đăng chưa chọn ca làm việc", 2)
        }

        if (!body.jobTitle) {
            message.warning("Bài đăng chưa có tiêu đề", 2)
        }

        if (!body.jobType) {
            message.warning("Bài đăng chưa chọn loại công việc", 2)
        }

        if (!body.expirationDate) {
            message.warning("Bài đăng chưa chọn ngày hết hạn", 2)
        }

        if (!body.jobTitle) {
            message.warning("Bài đăng chưa có tiêu đề", 2)
        }

        if (!body.description) {
            message.warning("Bài đăng chưa có mô tả", 2)
        }

        if (!body.employerBranchID) {
            message.warning("Bài đăng chưa chọn chi nhánh tuyển dụng", 2)
        }

        if (
            body.shifts &&
            body.description &&
            body.jobTitle &&
            body.jobType &&
            body.employerBranchID &&
            body.expirationDate &&
            employer
        ) {
            let newBody = this.pretreatmentBody(body, typeCpn);
            let METHOD = typeCpn === TYPE.EDIT ? PUT : POST;

            await _requestToServer(
                METHOD,
                EM_CONTROLLER + `/${employer.id}/jobs`,
                newBody,
                null,
                undefined,
                undefined,
                true,
                false,
            ).then((res: any) => {
                setTimeout(() => {
                    this.props.history.push('/admin/pending-jobs/list');
                }, 500);
            })
        }

    }

    pretreatmentBody = (body?: IAnnoucementBody, typeCpn?: string) => {
        let newBody = body;
        newBody.shifts.forEach((element: any, index: number) => {
            element.genderRequireds = element.genderRequireds.map((item: any, index: number) => {
                if (item.id && typeCpn === TYPE.EDIT) {
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

        if (typeCpn !== TYPE.EDIT) {
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
            typeCpn,
            body,
            employer
        } = this.state;

        let {
            listJobNames,
            listEmBranches,
            listSkills,
            list_employers
        } = this.props;

        let ct_btn_ex = "Huỷ";
        let ct_btn_nt = "Lưu lại";

        switch (typeCpn) {
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

        let list_job_name_options = listJobNames.map((item: IJobName) => ({ label: item.name, value: item.id }));
        let listEmBranches_options = listEmBranches.map((item: IEmBranch) => ({ label: item.branchName, value: item.id }));
        let list_skill_options = listSkills.map((item: ISkill, index: number) => (<Option key={index} value={item.name} children={item.name} />));
        let list_em_ployer_options = list_employers.map((item: IEmployer, index: number) => ({ label: item.employerName, value: item.id }));

        return (
            <div className='common-content'>
                <h5>
                    Đăng bài hộ
                </h5>
                <Divider orientation="left" >Nội dung công việc</Divider>
                <div className="anno-create">
                    <InputTitle
                        type={TYPE.INPUT}
                        title="Tiêu đề"
                        widthLabel="200px"
                        children={
                            <TextArea
                                style={{ width: '100%' }}
                                maxLength={400}
                                placeholder="ex: Tuyển nhân viên bán hàng  (Tối đa : 400)"
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
                    <div style={{ textAlign: "center" }}>
                        Hiện tại:
                        <span
                            style={
                                { color: body.jobTitle && body.jobTitle.length < 6000 ? '#168ECD' : 'red' }
                            }
                            children={body.jobTitle && body.jobTitle.length ? body.jobTitle.length : 0}
                        />  kí tự
                    </div>
                    <InputTitle
                        title="Nội dung bài đăng"
                        widthLabel="200px"
                        widthComponent="400px"
                    >
                        <TextArea
                            rows={12}
                            style={{ width: '100%' }}
                            maxLength={10000}
                            placeholder="ex: Yêu cầu: giao tiếp tiếng Anh tốt (Tối đa : 10000)"
                            value={body.description}
                            onChange={
                                (event: any) => {
                                    body.description = event.target.value;
                                    this.setState({ body });
                                }
                            }
                        />
                    </InputTitle>
                    <div style={{ textAlign: "center" }}>
                        Hiện tại:
                        <span
                            style={
                                { color: body.description && body.description.length < 6000 ? '#168ECD' : 'red' }
                            }
                            children={body.description && body.description.length ? body.description.length : 0}
                        />  kí tự
                    </div>
                    <InputTitle
                        title="Chọn thời gian hết hạn"
                        type="SWITCH"
                        widthLabel="200px"
                    >
                        <DatePicker
                            format={"DD/MM/YYYY"}
                            style={{ width: '100%' }}
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
                        listValue={list_job_name_options}
                        onChange={
                            (event: any) => {
                                body.jobNameID = event;
                                this.setState({ body });
                            }
                        }
                        widthLabel="200px"
                        widthSelect="100%"
                        placeholder="ex: Nhân viên văn phòng"
                    />
                    <InputTitle
                        title="Chọn nhà tuyển dụng"
                        type={TYPE.SELECT}
                        listValue={list_em_ployer_options}
                        onChange={
                            async (event: string) => {
                                employer.id = event;
                                this.setState({ employer });
                                this.props.getListEmBranches(0, 0, null, event);
                            }
                        }
                        onSearch={
                            async (event: any) => {
                                this.props.getListEmployers(0, 0, { employerName: event });
                            }
                        }
                        widthLabel="200px"
                        widthSelect="100%"
                        placeholder="ex: Công ti abc"
                    />
                    <InputTitle
                        title="Chọn địa chỉ đăng tuyển"
                        type={TYPE.SELECT}
                        listValue={listEmBranches_options}
                        onChange={
                            (event: any) => {
                                body.employerBranchID = event
                                this.setState({ body });
                            }
                        }
                        widthLabel="200px"
                        widthSelect="100%"
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
                            onChange={
                                (event: any) => {
                                    let newRequiredSkillIDs = findIdWithValue(listSkills, event, "name", "id")
                                    body.requiredSkillIDs = newRequiredSkillIDs;
                                    this.setState({ body })
                                }
                            }
                            style={{ width: '100%' }}
                        >
                            {list_skill_options}
                        </Select>
                    </InputTitle>
                </div>
                <Divider orientation="left" >Chọn loại công việc</Divider>
                <div className="anno-create">
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
                <div className="anno-create">
                    <Button
                        type="danger"
                        prefix={"check"}
                        style={{
                            margin: "10px 10px",
                        }}
                        icon={"close"}
                        onClick={() => { this.props.history.push('/v1/admin/jobs/job-announcements/list') }}
                    >
                        {ct_btn_ex}
                    </Button>
                    <Button
                        type="primary"
                        prefix={"check"}
                        style={{
                            margin: "10px 10px",
                            float: "right"
                        }}
                        onClick={() => this.createRequest()}
                        icon={"plus"}
                    >
                        {ct_btn_nt}
                    </Button>

                </div>
            </div >
        )
    };
};

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getPendingsJobDetail: (id) =>
        dispatch({ type: REDUX_SAGA.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL, id }),
    getListEmBranches: (pageIndex?: number, pageSize?: number, body?: IEmBranchesFilter, id?: string) =>
        dispatch({ type: REDUX_SAGA.EM_BRANCHES.GET_EM_BRANCHES, pageIndex, pageSize, id }),
    getListEmployers: (pageIndex?: number, pageSize?: number, body?: IEmBranchesFilter) =>
        dispatch({ type: REDUX_SAGA.EMPLOYER.GET_EMPLOYER, pageIndex, pageSize, body }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    listJobNames: state.JobNames.items,
    listSkills: state.Skills.items,
    listEmBranches: state.EmBranches.items,
    list_employers: state.Employers.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PendingJobsCreate)