import React, { Component } from 'react'
import { Icon, Divider, Row, Col, Button, Tabs, message, Empty, Drawer } from 'antd';
import { connect } from 'react-redux';
import { REDUX_SAGA } from '../../../../../const/actions';
import { TYPE } from '../../../../../const/type';
import { IAppState } from '../../../../../redux/store/reducer';
import ShiftContent from '../../../layout/annou-shift/AnnouShift';
import { IEmBranch } from '../../../../../models/em-branches';
import { _requestToServer } from '../../../../../services/exec';
import { PUT } from '../../../../../const/method';
import { APPLY_JOB } from '../../../../../services/api/private.api';
import { IApplyJob } from './../../../../../models/apply-jobs';
import { ApplyJobItem } from '../../../layout/job-apply/JobApplyItem';
import { routeLink, routePath } from '../../../../../const/break-cumb';
import './JobAnnouncementsApply.scss';
import { IShiftDetail } from '../../../../../models/job-annoucement-detail';
import Loading from '../../../layout/loading/Loading';
import { IApplyCan } from '../../../../../models/apply-cans';
import { IShifts } from '../../../../../models/pending-jobs';
import CandidatetInfo from '../../../layout/candidate-info/CandidatetInfo';

const { TabPane } = Tabs;

interface IState {
    title: string;
    announcementTypeID: string;
    typeManagement: Array<any>;
    list_item: Array<{ label: string, value: string }>,
    loading: boolean;
    value_annou: string;
    typeCpn: string;
    listEmBranches: Array<IEmBranch>;
    listApplyCans?: Array<IApplyCan>;
    id?: string;
    jobName?: string;
    address?: string;
    skills?: Array<string>
    state?: string;
    list_pending?: Array<IApplyJob>;
    list_accepted?: Array<IApplyJob>;
    list_rejected?: Array<IApplyJob>;
    list_shifts?: Array<IShiftDetail>;
    l_btn?: boolean;
    openDrawer?: boolean;
    default_id?: string;
};

interface IProps extends StateProps, DispatchProps {
    match: any;
    history: any;
    location: any;
    getApplyCans: Function;
    getListEmBranches: Function;
    getCandidateDetail: Function;
    getStudentDetail: Function;
};


class JobAnnouncementsApply extends Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            announcementTypeID: "",
            typeManagement: [],
            list_item: [],
            loading: false,
            value_annou: "",
            listEmBranches: [],
            typeCpn: null,
            listApplyCans: [],
            id: null,
            list_pending: [],
            list_accepted: [],
            list_rejected: [],
            list_shifts: [],
            default_id: null,
            l_btn: false,
            openDrawer: false,
        };
    };

    async componentDidMount() {
        if (this.props.match.params.id) {
            let id = this.props.match.params.id;
            await this.props.getApplyCans(id, TYPE.PENDING);
        };

        this.props.getListEmBranches();
    };

    static getDerivedStateFromProps(props: IProps, state: IState) {
        if (
            props.match.params.id &&
            props.match.params.id !== state.id
        ) {
            let listApplyCans = props.listApplyCans;
            const param = new URLSearchParams(props.location.search);
            const state = param.get('state');
            return {
                id: props.match.params.id,
                listApplyCans,
                state
            }
        }

        if (
            props.listApplyCans &&
            props.listApplyCans !== state.listApplyCans
        ) {
            let listApplyCans = props.listApplyCans;
            let list_pending = [];
            let list_accepted = [];
            let list_rejected = [];
            if (listApplyCans && listApplyCans.length > 0) {
                listApplyCans.forEach((item: IApplyJob, index: number) => {
                    switch (item.state) {
                        case TYPE.PENDING:
                            list_pending.push(item);
                            break;
                        case TYPE.REJECTED:
                            list_rejected.push(item);
                            break;
                        case TYPE.ACCEPTED:
                            list_accepted.push(item);
                            break;

                        default:
                            break;
                    }
                })
            }
            return {
                listApplyCans,
                list_pending,
                list_rejected,
                list_accepted,
            }
        }

        return { loadingTable: false }
    }

    searchShift = (id?: string, type?: string, default_id?: string) => {
        console.log(id, type, default_id);
        let { listApplyCans } = this.state;
        this.setState({ loading: true })
        let list_shifts = [];
        setTimeout(() => {
            if (id) {
                listApplyCans.forEach((item: IApplyCan) => {
                    if (item.student && default_id === item.student.id) {
                        list_shifts = item.appliedShifts;
                    }
                });
            }

            this.setState({ list_shifts, loading: false })
        }, 250);

        this.setState({ default_id })
    }

    createRequest = async (cid?: string, state?: 'PENDING' | 'REJECTED' | 'ACCEPTED') => {
        let { id } = this.state;
        await this.setState({ l_btn: true });
        await _requestToServer(
            PUT,
            APPLY_JOB + `/${id}/apply/candidates/${cid}/state/${state}`,
            undefined,
            undefined,
            undefined,
        ).then((res: any) => {
            if (res) {
                message.success("Thành công", 3)
                this.props.getApplyCans(id);
            }
        })
        await this.setState({ l_btn: false })
    }

    render() {
        let { studentDetail } = this.props;
        let {
            state,
            list_rejected,
            list_accepted,
            list_pending,
            list_shifts,
            loading,
            default_id,
            l_btn,
            openDrawer
        } = this.state;

        return (
            <div className='common-content'>
                <h5>
                    Danh sách ứng viên công việc
                </h5>
                <Divider orientation="left" >Danh sách yêu cầu</Divider>
                <Drawer
                    title="Lọc nâng cao"
                    placement="right"
                    width={"60vw"}
                    closable={true}
                    onClose={() => this.setState({ openDrawer: false })}
                    visible={openDrawer}
                >
                    {
                        <CandidatetInfo
                            data={studentDetail}
                            onClickButton={() => this.createRequest(TYPE.CERTIFICATE)}
                            loading={loading}
                        />
                    }
                </Drawer>
                <div className="announcements-Apply-content">
                    <Row>
                        <Col xs={24} md={10} lg={12} xl={10} xxl={12}>
                            {<Tabs
                                activeKey={state}
                                style={{ width: "100%" }}
                                onChange={(state: string) => {
                                    this.setState({ state })
                                }}
                            >
                                <TabPane
                                    tab={`Đang chờ`}
                                    key={TYPE.PENDING}
                                    disabled={list_pending.length === 0}
                                    style={{ paddingRight: 10 }}
                                >
                                    <div className="content-apply">
                                        {
                                            list_pending.length === 0 ? <Empty style={{ paddingTop: "5vh" }} /> : (list_pending.map((item: IApplyCan, index: number) =>
                                                <ApplyJobItem
                                                    key={index}
                                                    type="PENDING"
                                                    l_btn={l_btn}
                                                    data={item}
                                                    id={item && item.student ? item.student.id : null}
                                                    id_default={item.student.id === default_id}
                                                    onChangeFilter={(id?: string, state?: 'PENDING' | 'REJECTED' | 'ACCEPTED') => this.createRequest(id, state)}
                                                    onClick={
                                                        (event: string) => this.searchShift(event, TYPE.PENDING, item.student.id)
                                                    }
                                                    onView={
                                                        () => {
                                                            this.setState({ openDrawer: true });
                                                            setTimeout(() => {
                                                                this.props.getStudentDetail(item.student.id)
                                                            }, 500);
                                                        }
                                                    }
                                                />
                                            ))
                                        }
                                    </div>
                                </TabPane>
                                <TabPane tab={`Chấp nhận`} key={TYPE.ACCEPTED} disabled={list_accepted.length === 0}>
                                    <div className="content-apply">
                                        {
                                            list_accepted.length === 0 ? <Empty style={{ paddingTop: "5vh" }} /> : (list_accepted.map((item: IApplyCan, index: number) =>
                                                <ApplyJobItem
                                                    key={index}
                                                    type={"ACCEPTED"}
                                                    data={item}
                                                    id={item.student ? item.student.id : null}
                                                    id_default={item.student.id === default_id}
                                                    onChangeFilter={(id?: string, state?: 'PENDING' | 'REJECTED' | 'ACCEPTED') => this.createRequest(id, state)}
                                                    onClick={
                                                        (event: string) => this.searchShift(event, TYPE.ACCEPTED, item.student.id)
                                                    }
                                                    onView={
                                                        () => {
                                                            this.setState({ openDrawer: true });
                                                            setTimeout(() => {
                                                                this.props.getStudentDetail(item.student.id)
                                                            }, 500);
                                                        }
                                                    }
                                                />
                                            ))
                                        }
                                    </div>
                                </TabPane>
                                <TabPane tab={`Từ chối`} key={TYPE.REJECTED} disabled={list_rejected.length === 0} >
                                    <div className="content-apply">
                                        {
                                            list_rejected.length === 0 ? <Empty style={{ paddingTop: "5vh" }} /> : list_rejected.map(
                                                (item: IApplyCan, index: number) =>
                                                    <ApplyJobItem
                                                        type="REJECTED"
                                                        key={index}
                                                        data={item}
                                                        id={item.student ? item.student.id : null}
                                                        id_default={item.student.id === default_id}
                                                        onChangeFilter={(id?: string, state?: 'PENDING' | 'REJECTED' | 'ACCEPTED') => this.createRequest(id, state)}
                                                        onClick={
                                                            (event: string) => this.searchShift(event, TYPE.REJECTED, item.student.id)
                                                        }
                                                        onView={
                                                            () => {
                                                                this.setState({ openDrawer: true });
                                                                setTimeout(() => {
                                                                    this.props.getCandidateDetail(item.student.id)
                                                                }, 500);
                                                            }
                                                        }
                                                    />
                                            )
                                        }
                                    </div>
                                </TabPane>
                            </Tabs>}
                        </Col>
                        <Col xs={24} md={14} lg={12} xl={14} xxl={12}>
                            <p
                                style={{
                                    margin: "10px 20px -10px",
                                    fontWeight: 600
                                }}
                            >
                                Thông tin ca
                            </p>
                            {loading ? <Loading /> :
                                <div className="job-announcements-apply">
                                    {
                                        list_shifts &&
                                            list_shifts.length > 0 ?
                                            list_shifts.map(
                                                (item: IShifts, index: number) => {
                                                    if (item) {
                                                        return <ShiftContent key={index} id={item.id} shifts={item} removeButton={false} disableChange={true} />
                                                    } else {
                                                        return ''
                                                    }
                                                }
                                            ) : <Empty style={{ paddingTop: "5vh" }} />
                                    }
                                </div>
                            }
                        </Col>
                    </Row>
                </div>
                <div className="Announcements-Apply-content">
                    <Button
                        type="danger"
                        prefix={"check"}
                        style={{
                            margin: "10px 10px",
                        }}
                        onClick={() => { this.props.history.push(routeLink.JOB_ANNOUNCEMENTS + routePath.LIST) }}
                    >
                        <Icon type="left" />
                        Quay lại
                    </Button>
                </div>

            </div >
        )
    };
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getApplyCans: (id?: string) => dispatch({ type: REDUX_SAGA.APPLY_CAN.GET_APPLY_CAN, id }),
    getListEmBranches: () => dispatch({ type: REDUX_SAGA.EM_BRANCHES.GET_EM_BRANCHES }),
    // getCandidateDetail: (id?: string) => dispatch({ type: REDUX_SAGA.CANDIDATES.GET_CANDIDATE_DETAIL, id }),
    getStudentDetail: (id?: string) => dispatch({ type: REDUX_SAGA.STUDENTS.GET_STUDENT_DETAIl, id })
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    listJobNames: state.JobNames.items,
    listSkills: state.Skills.items,
    listEmBranches: state.EmBranches.items,
    listApplyCans: state.ApplyCans.items,
    studentDetail: state.StudentDetail
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobAnnouncementsApply)