import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import './PendingJobsList.scss';

import { REDUX_SAGA, REDUX } from '../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, Modal, Input, Tooltip } from 'antd';
import { timeConverter } from '../../../../../utils/convertTime';
import { _requestToServer } from '../../../../../services/exec';
import { POST } from '../../../../../const/method';
import { PENDING_JOBS } from '../../../../../services/api/private.api';
import { TYPE } from '../../../../../const/type';
import { IptLetter, IptLetterP } from '../../../layout/common/Common';
import { IPendingJob } from '../../../../../models/pending-jobs';
import { IAppState } from '../../../../../redux/store/reducer';
import JobDetail from '../../../layout/job-detail/JobDetail';
import { IModalState, IDrawerState } from '../../../../../models/mutil-box';
import DrawerConfig from '../../../layout/config/DrawerConfig';
import EmInfo from '../../../layout/em-info/EmInfo';
import { IEmController } from '../../../../../models/em-controller';
import { IEmployer } from '../../../../../models/employers';

let { Option } = Select;
const { TextArea } = Input;

const Label = (props: any) => {
    let value = "";
    switch (props.type) {
        case TYPE.PENDING:
            value = "Đang chờ";
            break;
        case TYPE.ACCEPTED:
            value = "Đã chấp nhận";
            break;
        case TYPE.REJECTED:
            value = "Đã từ chối";
            break;
        case TYPE.PARTTIME:
            value = "Bán thời gian";
            break;
        case TYPE.FULLTIME:
            value = "Toàn thời gian";
            break;
        case TYPE.INTERNSHIP:
            value = "Thực tập sinh";
            break;
    }

    if (props.type) {
        return <label className={props.type.toLowerCase()}>{value}</label>
    }
    return
};

interface IPendingJobListProps extends StateProps, DispatchProps {
    match?: any,
    history?: any,
    getPendingJobs: Function,
    getPendingJobDetail: (id?: string) => any;
    handleModal: (modalState?: IModalState) => any;
    getEmployerDetail: (id?: string) => any;
    handleDrawer: (drawerState?: IDrawerState) => any;
    getListEmployer: Function;
}

interface IPendingJobListState {
    dataTable?: Array<any>;
    search?: any;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    employerID?: string;
    jobType?: string;
    jobNameID?: string;
    jobId?: string;
    show_job?: boolean;
    loading?: boolean;
    pendingJob?: any;
    message?: string;
    loadingTable?: boolean;
    listJobs?: Array<IPendingJob>
    id?: string;
}

class PendingJobsList extends PureComponent<IPendingJobListProps, IPendingJobListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            dataTable: [],
            pageSize: 10,
            state: TYPE.PENDING,
            employerID: undefined,
            jobType: undefined,
            jobNameID: undefined,
            pageIndex: 0,
            show_job: false,
            loading: false,
            loadingTable: true,
            jobId: null,
            id: null,
        }
    }

    columns = [
        {
            title: '#',
            width: 50,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
            fixed: 'left',
        },
        {
            title: 'Nhà tuyển dụng',
            dataIndex: 'employerName',
            key: 'employerName',
            width: 200,
            fixed: 'left'
        },
        {
            title: 'Tiêu đề',
            width: 200,
            dataIndex: 'jobTitle',
            key: 'jobTitle',
        },
        {
            title: 'Công việc',
            width: 150,
            dataIndex: 'jobName',
            className: 'action',
            key: 'jobName',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'state',
            className: 'action',
            key: 'state',
            width: 150,
        },
        {
            title: 'Loại công việc',
            dataIndex: 'jobType',
            className: 'action',
            key: 'jobType',
            width: 150,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 150,
        },
        {
            title: 'Tên chi nhánh',
            dataIndex: 'employerBranchName',
            key: 'employerBranchName',
            width: 200,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 300,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            dataIndex: 'operation',
            fixed: 'right',
            className: 'action',
            width: 100
        },
    ];

    async componentDidMount() {
        await this.searchPendingJob()
    }

    searchPendingJob = async () => {
        let { employerID, state, jobType, jobNameID, pageIndex, pageSize } = this.state;
        await this.setState({ loadingTable: true });
        await setTimeout(() => {
            this.props.getPendingJobs({
                employerID,
                state,
                jobType,
                jobNameID,
                pageIndex,
                pageSize
            })
        }, 250);
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.searchPendingJob();
    };

    static getDerivedStateFromProps(nextProps: IPendingJobListProps, prevState: IPendingJobListState) {
        if (nextProps.listJobs && nextProps.listJobs !== prevState.listJobs) {
            let dataTable: any = [];
            let { pageIndex, pageSize } = prevState;

            nextProps.listJobs.forEach((item?: IPendingJob, index?: number) => {
                dataTable.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    jobName: item.jobName && item.jobName.name,
                    state: <Label type={item.state} value={item.state} />,
                    address: item.address ? item.address : "",
                    employerName: item.employer.employerName ? item.employer.employerName : "",
                    title: item.jobTitle,
                    createdDate: timeConverter(item.createdDate, 1000),
                    jobTitle: item.jobTitle,
                    employerBranchName: item.employerBranchName ? item.employerBranchName : "",
                    jobType: <Label type={item.jobType} value={item.jobType} />,
                    operation:
                        <>
                            <Tooltip title={'Xem chi tiết'}>
                                <Icon
                                    className='test'
                                    type="file-search"
                                    style={{ padding: 5, margin: 2 }}
                                    onClick={
                                        async () => {
                                            nextProps.handleModal({ openModal: true });
                                            nextProps.getPendingJobDetail(item.id);
                                        }
                                    }
                                />
                            </Tooltip>
                            <Tooltip title={'Xem NTD'}>
                                <Icon
                                    className='test'
                                    type="home"
                                    style={{ padding: 5, margin: 2 }}
                                    onClick={
                                        async () => {
                                            nextProps.handleDrawer({ openDrawer: true });
                                            setTimeout(() => {
                                                nextProps.getEmployerDetail(item.employer.id);
                                            }, 500);
                                        }
                                    }
                                />
                            </Tooltip>
                        </>

                });
            });
            return {
                listJobs: nextProps.listJobs,
                dataTable,
                loadingTable: false
            }
        }
        return null;
    }

    onChangeState = async (event: any) => {
        await this.setState({ state: event });
        await this.searchPendingJob();
    };

    onChangeJobType = async (event: any) => {
        await this.setState({ jobType: event });
        await this.searchPendingJob();
    };

    onChangeEmployer = async (value: any) => {
        let { listEmployer } = this.props;
        let data = listEmployer.filter(
            (item: IEmployer, index: number) => (item.employerName === value)
        );
        if (data.length > 0) {
            value = data[0].id
        }
        await this.setState({ employerID: value })
        await this.searchPendingJob();
    };

    onChangeJobName = async (event: any) => {
        await this.setState({ jobNameID: event });
        await this.searchPendingJob();
    };

    onToggleModal = () => {
        let { show_job, message } = this.state;
        if (show_job) {
            message = ""
        }
        this.setState({ show_job: !show_job, message, loading: false });
    };

    handlePendingJob = async (state?: string) => {
        let { jobId, message } = this.state;
        let body = state === "accepted" ? undefined : { message };
        await this.setState({ loading: true });
        await _requestToServer(
            POST, PENDING_JOBS + `/${jobId}/${state}`,
            body,
            null, null, undefined, true, false
        ).finally(
            () => this.setState({ loading: false })
        );
        await this.props.handleModal({ openModal: false })
        await this.searchPendingJob();
    };

    render() {
        let {
            dataTable,
            loading,
            message,
            loadingTable,
            state,
        } = this.state;

        let {
            listJobNames,
            totalItems,
            jobDetail,
            openModal,
            employerDetail,
            listEmployer
        } = this.props;

        return (
            <>
                <DrawerConfig
                    width={'50vw'}
                    title={"Thông tin nhà tuyển dụng"}
                >
                    <EmInfo data={employerDetail} />
                    <Button
                        icon={"left"}
                        onClick={
                            () => this.props.handleDrawer({ openDrawer: false })
                        }
                    >
                        Thoát
                    </Button>
                </DrawerConfig>
                <Modal
                    visible={openModal}
                    title="CHI TIẾT CÔNG VIỆC"
                    onCancel={() => this.props.handleModal({ openModal: false })}
                    destroyOnClose={true}
                    width={'50vw'}
                    style={{ top: "5vh" }}
                    footer={[
                        <TextArea
                            key="reason-msg"
                            value={message}
                            placeholder="Lý do từ chối"
                            onChange={event => this.setState({ message: event.target.value })}
                            rows={3}
                            style={{ margin: "10px 0px", }}
                        />,
                        <Button
                            key="back"
                            type="danger"
                            icon={loading ? "loading" : "close"}
                            loading={loading}
                            onClick={async () => await this.handlePendingJob("rejected")}
                            disabled={state === TYPE.REJECTED || !message}
                        >
                            Từ chối
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            icon={loading ? "loading" : "check"}
                            onClick={async () => await this.handlePendingJob("accepted")}
                            disabled={state === TYPE.ACCEPTED}
                        >
                            Chấp nhận
                        </Button>
                    ]}
                >
                    <JobDetail
                        jobDetail={{
                            jobName: jobDetail.jobName && jobDetail.jobName.name,
                            jobTitle: jobDetail.data.jobTitle,
                            employerName: jobDetail.employer.employerName,
                            employerUrl: jobDetail.employer.logoUrl,
                            expriratedDate: jobDetail.data.expirationDate,
                            shifts: jobDetail.data.shifts,
                            description: jobDetail.data.description,
                            jobType: jobDetail.data.jobType,
                            createdDate: jobDetail.createdDate,
                            data: jobDetail.data
                        }}
                    />
                </Modal>
                <div className="common-content">
                    <h5>
                        Danh sách yêu cầu xét duyệt {`(${totalItems})`}
                        {/* <Button
                            icon="filter"
                            onClick={() => this.searchPendingJob()}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            Lọc
                        </Button> */}
                    </h5>
                    <div>
                        <div className="table-operations">
                            <Row>
                                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                                    <IptLetterP value={"Tên nhà tuyển dụng"} />
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) => this.onChangeEmployer(event)}
                                        onSearch={(event) => { this.props.getListEmployer({ employerName: event }, 0, 10) }}
                                    >
                                        <Option key={1} value={null}>Tất cả</Option>
                                        {
                                            listEmployer && listEmployer.map((item?: IEmController, i?: any) =>
                                                (<Option key={item.id} value={item.employerName}>{item.employerName + '(' + item.email + ')'} </Option>)
                                            )
                                        }
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5.5} xl={6} xxl={6}>
                                    <p>
                                        <IptLetter value={"Trạng thái xét duyệt"} />
                                    </p>
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        defaultValue="Đang chờ"
                                        onChange={this.onChangeState}
                                    >
                                        <Option key="1" value={undefined}>Tất cả</Option>
                                        <Option key="2" value={TYPE.PENDING}>Đang chờ</Option>
                                        <Option key="3" value={TYPE.REJECTED}>Đã từ chối</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5.5} xl={6} xxl={6}>
                                    <p>
                                        <IptLetter value={"Tên công việc"} />
                                    </p>
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Tất cả công việc"
                                        optionFilterProp="children"
                                        onChange={this.onChangeJobName}
                                    >
                                        <Option key={1} value={undefined}>Tất cả</Option>
                                        {
                                            listJobNames &&
                                            listJobNames.map((item: any, index: number) =>
                                                <Option key={index + 1} value={item.id}>{item.name}</Option>)
                                        }
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={3} xl={3} xxl={3}>
                                    <p>
                                        <IptLetter value={"Loại công việc"} />
                                    </p>
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={this.onChangeJobType}
                                    >
                                        <Option key="1" value={undefined}>Tất cả</Option>
                                        <Option key="2" value={TYPE.PARTTIME}>Part-time</Option>
                                        <Option key="3" value={TYPE.FULLTIME}>Full-time</Option>
                                        <Option key="4" value={TYPE.INTERNSHIP}>Thực tập</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={dataTable}
                            locale={{ emptyText: 'Không có dữ liệu' }}
                            scroll={{ x: 1650 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={
                                (event: any) => ({
                                    onMouseEnter: () => this.setState({ jobId: event.key })
                                })
                            }
                        />
                    </div>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getPendingJobs: (body?: any) => dispatch({
        type: REDUX_SAGA.PENDING_JOBS.GET_PENDING_JOBS,
        body
    }),
    getPendingJobDetail: (id?: string) =>
        dispatch({
            type: REDUX_SAGA.PENDING_JOB_DETAIL.GET_PENDING_JOB_DETAIL,
            id
        }),
    getListEmployer: (body?: any, pageIndex?: number, pageSize?: number) =>
        dispatch({
            type: REDUX_SAGA.EMPLOYER.GET_EMPLOYER,
            body,
            pageIndex,
            pageSize,
        }),
    getEmployerDetail: (id?: string) =>
        dispatch({ type: REDUX_SAGA.EM_CONTROLLER.GET_EM_CONTROLLER_DETAIL, id }),
    handleModal: (modalState?: IModalState) =>
        dispatch({ type: REDUX.HANDLE_MODAL, modalState }),
    handleDrawer: (drawerState?: IDrawerState) =>
        dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    listJobs: state.PendingJobs.items,
    listJobNames: state.JobNames.items,
    listJobSkills: state.Skills.items,
    modalState: state.MutilBox.modalState,
    employerDetail: state.EmployerDetail,
    jobDetail: state.PendingJobDetail,
    openModal: state.MutilBox.modalState.openModal,
    totalItems: state.PendingJobs.totalItems,
    listEmployer: state.Employers.items
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PendingJobsList);