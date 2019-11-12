import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA } from '../../../../common/const/actions';
import { Button, Table, Icon, Select, Row, Col, Modal, Input } from 'antd';
import { timeConverter } from '../../../../common/utils/convertTime';
import './PendingJobs.scss';
import { _requestToServer } from '../../../../services/exec';
import { GET, POST } from './../../../../common/const/method';
import { PENDING_JOBS_API } from '../../../../services/api/private.api';
import { authHeaders } from '../../../../services/auth';
import { ADMIN_HOST } from '../../../../environment/dev';
import JobProperties from './job-properties/JobProperties';
import { TYPE } from './../../../../common/const/type';
import { IptLetter } from '../../layout/common/Common';

let { Option } = Select;
const { TextArea } = Input

const Label = (props) => {
    let value = "";
    switch (props.type) {
        case TYPE.PENDING:
            value = "Đang chờ"
            break;
        case TYPE.ACCEPTED:
            value = "Đã chấp nhận"
            break;
        case TYPE.REJECTED:
            value = "Từ chối"
            break;
        case TYPE.PARTTIME:
            value = "Bán thời gian"
            break;
        case TYPE.FULLTIME:
            value = "Toàn thời gian"
            break;
        case TYPE.INTERSHIP:
            value = "Thực tập sinh"
            break;
    }

    return <label className={props.type.toLowerCase()}>{value}</label>
}

interface PendingJobProps extends StateProps, DispatchProps {
    match?: any,
    getPendingJobs: Function
}

interface PendingJobState {
    data_table?: Array<any>;
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
    loading_table?: boolean;
}

class PendingJobs extends PureComponent<PendingJobProps, PendingJobState> {
    constructor(props) {
        super(props);
        this.state = {
            data_table: [],
            pageSize: 10,
            state: TYPE.PENDING,
            employerID: null,
            jobType: null,
            jobNameID: null,
            pageIndex: 0,
            jobId: "",
            show_job: false,
            loading: false,
            loading_table: true,
        }
    }

    columns = [
        {
            title: '#',
            width: 20,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
            fixed: 'left',
        },
        {
            title: 'Tiêu đề',
            width: 200,
            dataIndex: 'jobTitle',
            key: 'jobTitle',
        },
        {
            title: 'Công việc',
            width: 180,
            dataIndex: 'jobName',
            key: 'jobName',
        },
        {
            title: 'Tên nhà tuyển dụng',
            dataIndex: 'employerName',
            key: 'employerName',
            width: 140,
        },

        {
            title: 'Trạng thái',
            dataIndex: 'state',
            className: 'action',
            key: 'state',
            width: 75,
        },
        {
            title: 'Loại công việc',
            dataIndex: 'jobType',
            className: 'action',
            key: 'jobType',
            width: 100,
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 100,
        },
        {
            title: 'Ngày phản hồi',
            dataIndex: 'repliedDate',
            className: 'action',
            key: 'repliedDate',
            width: 100,
        },
        {
            title: 'Chi nhánh',
            dataIndex: 'employerBranchName',
            key: 'employerBranchName',
            width: 200,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: '6',
            width: 300,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            width: 75,
            render: () => <Button onClick={async () => await this.onToggleModal()} type="primary"><Icon type="file-search" /></Button>,
        },
    ];

    componentDidMount() {
        this.searchJob()
    }

    searchJob = () => {
        let { employerID, state, jobType, jobNameID, pageIndex } = this.state;
        this.props.getPendingJobs({
            employerID,
            state,
            jobType,
            jobNameID,
            pageIndex
        })
    }

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchJob();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_jobs && nextProps.list_jobs !== prevState.list_jobs) {
            let data_table = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_jobs.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) *  (pageSize ? pageSize : 10) + 1),
                    jobName: item.jobName.name,
                    state: <Label type={item.state} value={item.state} />,
                    address: item.address ? item.address : "",
                    employerName: item.employer.employerName ? item.employer.employerName : "",
                    title: item.jobTitle,
                    createdDate: timeConverter(item.createdDate, 1000),
                    jobTitle: item.jobTitle,
                    employerBranchName: item.employerBranchName ? item.employerBranchName : "",
                    jobType: <Label type={item.jobType} value={item.jobType} />,
                    repliedDate: item.repliedDate !== -1 ? timeConverter(item.repliedDate, 1000) : ""
                });
            })

            return {
                list_jobs: nextProps.list_jobs,
                data_table,
                loading_table: false
            }
        }
        return null;
    }


    onChangeState = (event) => {
        this.setState({ state: event })
    }

    onChangeJobType = (event) => {
        this.setState({ jobType: event })
    }

    onChangeEmployer = (event) => {
        this.setState({ employerID: event })
    }

    onChangeJobName = (event) => {
        this.setState({ jobNameID: event })
    }

    onToggleModal = () => {
        let { show_job, message } = this.state;
        if (show_job) {
            message = ""
        }
        this.setState({ show_job: !show_job, message });
    }

    // Get single pending job
    getPendingJobs = async (jobId) => {
        let res = await _requestToServer(
            GET,
            null,
            PENDING_JOBS_API + `/${jobId}`,
            ADMIN_HOST,
            authHeaders,
        )

        if (res.code === 200) {
            await this.setState({ pendingJob: res.data })

            if (res.data.message) {
                this.setState({ message: res.data.message })
            }
        }

        this.setState({ jobId });
    }

    handlePendingJob = async (state?: string) => {
        let { jobId, message } = this.state;
        await this.setState({ loading: true });
        await _requestToServer(
            POST,
            { message },
            PENDING_JOBS_API + `/${jobId}/${state}`,
            ADMIN_HOST,
            authHeaders,
            null,
            true
        );
        await this.setState({ loading: false });
        await this.onToggleModal();
        await this.searchJob();
    }

    render() {
        let { data_table, show_job, loading, pendingJob, message, loading_table } = this.state;
        let { list_jobs_group, totalItems } = this.props;
        let is_reject = message && message.trim() !== "" ? true : false

        return (
            <Fragment>
                <Modal
                    visible={show_job}
                    title="CHI TIẾT CÔNG VIỆC"
                    onCancel={this.onToggleModal}
                    style={{ top: "5vh" }}
                    footer={[
                        <TextArea
                            key="reason-msg"
                            value={message}
                            placeholder="Vui lòng điền lí do từ chối"
                            onChange={event => this.setState({ message: event.target.value })}
                            rows={3}
                            style={{ margin: "10px 0px", }}
                        />,
                        <Button
                            key="back"
                            type="danger"
                            onClick={async () => await this.handlePendingJob("rejected")}
                            disabled={!is_reject}
                        >
                            Từ chối
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={loading}
                            onClick={async () => await this.handlePendingJob("accepted")}
                            disabled={is_reject}
                        >
                            Chấp nhận
                        </Button>
                    ]}
                >
                    <JobProperties job_detail={pendingJob} />
                </Modal>
                <div className="common-content">
                    <h5>
                        Danh sách công việc đang chờ
                        <Button
                            onClick={() => this.searchJob()}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            <Icon type="filter" />
                            Tìm kiếm
                        </Button>
                    </h5>
                    <div>
                        <div className="table-operations">
                            <Row >
                                <Col xs={24} sm={12} md={8} lg={5.5} xl={6} xxl={6} >
                                    <p>
                                        <IptLetter value={" Chọn tên nhà tuyển dụng"} />
                                    </p>
                                    <Select
                                        showSearch
                                        placeholder="Tất cả nhà tuyển dụng"
                                        optionFilterProp="children"
                                        style={{ width: "100%" }}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value="jack">Jack</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="tom">Tom</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5.5} xl={6} xxl={6} >
                                    <p>
                                        <IptLetter value={"Chọn loại công việc"} />
                                    </p>
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={this.onChangeJobType}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={TYPE.PARTTIME}>Bán thời gian</Option>
                                        <Option value={TYPE.FULLTIME}>Toàn thời gian</Option>
                                        <Option value={TYPE.INTERSHIP}>Thực tập</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5.5} xl={6} xxl={6} >
                                    <p>
                                        <IptLetter value={"Chọn trạng thái công việc"} />
                                    </p>
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        defaultValue="Đang chờ"
                                        onChange={this.onChangeState}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={TYPE.PENDING}>Đang chờ</Option>
                                        <Option value={TYPE.REJECTED}>Từ chối</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5.5} xl={6} xxl={6} >
                                    <p>
                                        <IptLetter value={"Chọn công việc "} />
                                    </p>
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Tất cả  công việc"
                                        optionFilterProp="children"
                                        onChange={this.onChangeJobName}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        {
                                            list_jobs_group &&
                                            list_jobs_group.map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
                                        }
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <Table
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 2000 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="default"
                            onChange={this.setPageIndex}
                            onRow={(event) => ({ onClick: async () => await this.getPendingJobs(event.key) })}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getPendingJobs: (body) => dispatch({
        type: REDUX_SAGA.PENDING_JOBS.GET_PENDING_JOBS,
        body
    })
})

const mapStateToProps = (state, ownProps) => ({
    list_jobs: state.PendingJobs.list_jobs,
    totalItems: state.PendingJobs.totalItems,
    list_jobs_group: state.JobNames.items,
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PendingJobs)