import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA } from '../../../../common/const/actions';
import { Button, Table, Icon, Select, Row, Col } from 'antd';
import { timeConverter } from '../../../../common/utils/convertTime';
import './PendingJobs.scss';

let { Option } = Select;

interface AdminProps extends StateProps, DispatchProps {
    match?: any,
    getPendingJobs: Function
}

interface AdminState {
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    employerID?: string;
    jobType?: string;
    jobNameID?: string;
}

const columns = [
    {
        title: '#',
        width: 30,
        dataIndex: 'index',
        key: 'index',
        fixed: 'left',
    },
    {
        title: 'Tiêu đề',
        width: 170,
        dataIndex: 'jobTitle',
        key: 'jobTitle',
    },
    {
        title: 'Công việc',
        width: 150,
        dataIndex: 'jobName',
        key: 'jobName',
    },
    {
        title: 'Chi nhánh',
        dataIndex: 'employerBranchName',
        key: 'employerBranchName',
        width: 150,
    },
    {
        title: 'Ngày đăng',
        dataIndex: 'createdDate',
        key: 'createdDate',
        width: 100,
    },
    {
        title: 'Ngày phản hồi',
        dataIndex: 'repliedDate',
        key: 'repliedDate',
        width: 100,
    },
    {
        title: 'Tên nhà tuyển dụng',
        dataIndex: 'employerName',
        key: 'employerName',
        width: 100,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'state',
        key: 'state',
        width: 100,
    },
    {
        title: 'Loại công việc',
        dataIndex: 'jobType',
        key: 'jobType',
        width: 100,
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
        width: 100,
        render: () => <Button><Icon type="fix" /><Icon type="edit" /></Button>,
    },
];


class PendingJobs extends PureComponent<AdminProps, AdminState> {
    constructor(props) {
        super(props);
        this.state = {
            data_table: [],
            pageSize: 10,
            state: null,
            employerID: null,
            jobType: null,
            jobNameID: null
        }
    }

    componentDidMount() {
        this.searchJob()
    }

    searchJob = () => {
        let { employerID, state, jobType, jobNameID } = this.state;
        this.props.getPendingJobs({
            employerID,
            state,
            jobType,
            jobNameID,
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_jobs && nextProps.list_jobs !== prevState.list_jobs) {
            let data_table = [];
            nextProps.list_jobs.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index,
                    jobName: item.jobName.name,
                    state: item.state,
                    address: item.address,
                    employerName: item.employer.employerName,
                    title: item.jobTitle,
                    createdDate: timeConverter(item.createdDate, 1000),
                    jobTitle: item.jobTitle,
                    employerBranchName: item.employerBranchName,
                });
            })

            return {
                list_jobs: nextProps.list_jobs,
                data_table
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


    render() {
        let { data_table } = this.state;
        let { list_jobs_group } = this.props;
        return (
            <div className="pending-jobs_content">
                <h5> 
                    Danh sách công việc đang chờ
               </h5>
                <div>
                    <div className="table-operations">
                        <Row >
                            <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} >
                                <p>Chọn tên nhà tuyển dụng</p>
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Tất cả nhà tuyển dụng"
                                    optionFilterProp="children"
                                >
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="tom">Tom</Option>
                                    <Option value={null}>Tất cả</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} >
                                <p>Chọn loại công việc</p>
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    defaultValue="Tất cả"
                                    onChange={this.onChangeJobType}
                                >
                                    <Option value="PARTTIME">Bán thời gian</Option>
                                    <Option value="FULLTIME">Toàn thời gian</Option>
                                    <Option value="INTERN">Thực tập</Option>
                                    <Option value={null}>Tất cả</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={6} >
                                <p>Chọn trạng thái công việc</p>
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    defaultValue="Tất cả"
                                    onChange={this.onChangeState}
                                >
                                    <Option value="PENDING">Đang chờ</Option>
                                    <Option value="ACCEPTED">Đã duyệt</Option>
                                    <Option value="REJECTED">Từ chối</Option>
                                    <Option value={null}>Tất cả</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6} >
                                <p>Chọn nhóm công việc </p>
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="Tất cả  công việc"
                                    optionFilterProp="children"
                                    onChange={this.onChangeJobName}
                                >
                                    {
                                        list_jobs_group &&
                                        list_jobs_group.map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
                                    }
                                    <Option value={null}>Tất cả</Option>
                                </Select>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Button
                            onClick={this.searchJob}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "10px 10px"
                            }}
                        >
                            <Icon type="filter" />
                            Lọc
                        </Button>
                    </div>
                    <Table columns={columns} dataSource={data_table} scroll={{ x: 1500, y: 600 }} />
                </div>
            </div>
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
    list_jobs_group: state.JobType.items,
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PendingJobs)