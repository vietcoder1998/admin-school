import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA } from '../../../../common/const/actions';
import { Button, Table, Icon, Select, Row, Col, Modal, Input, DatePicker } from 'antd';
import { timeConverter, momentToUnix } from '../../../../common/utils/convertTime';
import './JobManagement.scss';
import { TYPE } from '../../../../common/const/type';

let { Option } = Select;
const { TextArea } = Input;

let ImageRender = (props) => {
    return <img src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} />
}

interface JobManagementProps extends StateProps, DispatchProps {
    match?: any,
    getTypeManagement: Function,
    getAnnoucements: Function
}

interface JobManagementState {
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    employerID?: string;
    target?: string;
    jobNameID?: string;
    jobId?: string;
    show_modal?: boolean;
    loading?: boolean;
    pendingJob?: any;
    message?: string;
    type_management?: Array<any>;
    value_type?: string;
    announcementTypeID?: number;
    createdDate?: number;
    adminID?: string;
    hidden?: boolean;
    list_announcements?: Array<any>;
}


class JobManagement extends PureComponent<JobManagementProps, JobManagementState> {
    constructor(props) {
        super(props);
        this.state = {
            target: null,
            type_management: [],
            announcementTypeID: null,
            createdDate: null,
            adminID: null,
            hidden: null,
            pageIndex: 0,
            list_announcements: []
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
            title: 'Ảnh đại diện',
            width: 60,
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            className: "action"
        },
        {
            title: 'Tiêu đề',
            width: 200,
            dataIndex: 'title',
            key: 'jobTitle',
        },

        {
            title: 'Người viết',
            dataIndex: 'admin',
            key: 'admin',
            width: 110,
        },
        {
            title: 'Người sửa',
            dataIndex: 'modifyAdmin',
            key: 'modifyAdmin',
            width: 110,
        },

        {
            title: 'Trạng thái',
            dataIndex: 'hidden',
            className: 'action',
            key: 'hidden',
            width: 80,
        },
        {
            title: 'Loại bài viết',
            dataIndex: 'announcementType',
            className: 'action',
            key: 'announcementType',
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
            title: 'Lần sửa cuối',
            dataIndex: 'lastModified',
            className: 'action',
            key: 'lastModified',
            width: 100,
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

    onToggleModal = () => {
        let { show_modal, message } = this.state;
        if (show_modal) {
            message = ""
        }
        this.setState({ show_modal: !show_modal, message });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.type_management !== prevState.type_management) {
            return {
                type_management: nextProps.type_management,
                value_type: "Tất cả",
                announcementTypeID: null
            }
        }

        if (nextProps.list_announcements !== prevState.list_announcements) {
            let { pageIndex } = prevState;
            let data_table = [];
            nextProps.list_announcements.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    title: item.title,
                    admin: item.admin ? (item.admin.firstName + " " + item.admin.lastName) : "",
                    modifyAdmin: item.modifyAdmin ? (item.modifyAdmin.firstName + " " + item.modifyAdmin.lastName) : "",
                    createdDate: timeConverter(item.createdDate, 1000),
                    lastModified: item.lastModified !== -1 ? timeConverter(item.lastModified, 1000) : "",
                    imageUrl: item.imageUrl ? <ImageRender src={item.imageUrl} alt="Ảnh đại diện" /> : "",
                    hidden: item.hidden ? "Hiện" : "Ẩn",
                    announcementType: item.announcementType.name
                });
            })
            return {
                list_announcements: nextProps.type_management,
                data_table,
            }
        } return null;
    }

    async componentDidMount() {
        await this.searchAnnouncement();
    }

    searchAnnouncement = async () => {
        let {
            pageIndex,
            createdDate,
            adminID,
            announcementTypeID,
            hidden,
            target,
        } = this.state;

        this.props.getAnnoucements({
            pageIndex,
            createdDate,
            adminID,
            announcementTypeID,
            hidden,
            target
        });
    }

    onChangeTarget = (event) => {
        this.setState({ target: event });
        this.props.getTypeManagement({ target: event });
    }

    onChangeJobName = (event) => {
        this.setState({ jobNameID: event })
    }

    onChangeType = (event) => {
        let { type_management } = this.state;
        type_management.forEach(item => {
            if (item.id === event) {
                this.setState({ value_type: item.name, announcementTypeID: item.id })
            }
        })
    }

    onChangeCreatedDate = (event) => {
        this.setState({ createdDate: momentToUnix(event) })
    }

    onChangeHidden = (event) => {
        let { hidden } = this.state;
        switch (event) {
            case 0:
                hidden = true
                break;
            case -1:
                hidden = false
                break;
            default:
                break;
        }

        this.setState({ hidden })
    }

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1 });
        await this.searchAnnouncement();
    }

    render() {
        let { data_table, show_modal, type_management, value_type, list_announcements } = this.state;
        return (
            <Fragment>
                <Modal
                    visible={show_modal}
                    title="CHI TIẾT CÔNG VIỆC"
                    onCancel={this.onToggleModal}
                    style={{ top: "5vh" }}
                    footer={[
                        <TextArea
                            key="reason-msg"
                            placeholder="Vui lòng điền lí do từ chối"
                            onChange={event => this.setState({ message: event.target.value })}
                            rows={3}
                            style={{ margin: "10px 0px", }}
                        />,
                        <Button
                            key="back"
                            type="danger"
                        // onClick={async () => await this.handleJobManagement("rejected")}
                        >
                            Từ chối
                    </Button>,
                        <Button
                            key="submit"
                            type="primary"
                        // onClick={async () => await this.handleJobManagement("accepted")}
                        >
                            Chấp nhận
                    </Button>
                    ]}
                >
                </Modal>
                <div className="pending-jobs_content">
                    <h5>
                        Quản lí bài viết
                        <Button
                            onClick={() => this.searchAnnouncement()}
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
                                    <p>Chọn loại đối tượng</p>
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={this.onChangeTarget}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={TYPE.SCHOOL}>Nhà trường</Option>
                                        <Option value={TYPE.EMPLOYER}>Nhà tuyển dụng</Option>
                                        <Option value={TYPE.CANDIDATE}>Ứng viên</Option>
                                        <Option value={TYPE.STUDENT}>Học sinh </Option>
                                        <Option value={TYPE.PUBLIC}>Public</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5.5} xl={6} xxl={6} >
                                    <p>Chọn loại bài đăng</p>
                                    <Select
                                        showSearch
                                        placeholder="Tất cả"
                                        optionFilterProp="children"
                                        style={{ width: "100%" }}
                                        value={value_type}
                                        onChange={this.onChangeType}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        {
                                            type_management &&
                                            type_management.map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
                                        }
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={5.5} xl={6} xxl={6} >
                                    <p>Chọn loại bài đăng</p>
                                    <DatePicker
                                        placeholder="Chọn ngày tạo bài"
                                        defaultValue={timeConverter('01/01/1970')}
                                        onChange={this.onChangeCreatedDate}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        {
                                            type_management &&
                                            type_management.map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
                                        }
                                    </DatePicker>
                                    <Select
                                        showSearch
                                        placeholder="Tất cả"
                                        style={{ margin: "5px 10px" }}
                                        defaultValue={"Tất cả"}
                                        onChange={this.onChangeHidden}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={0}>Đã ẩn</Option>
                                        <Option value={-1}>Hiện</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>
                        <Table
                            columns={this.columns}
                            dataSource={data_table} scroll={{ x: 1000 }}
                            bordered
                            pagination={{ total: 20 }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRowClick={async event => { }}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getTypeManagement: (data) => dispatch({ type: REDUX_SAGA.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT, data }),
    getAnnoucements: (body) => dispatch({ type: REDUX_SAGA.ANNOUNCEMENTS.GET_ANNOUNCEMENTS, body })
})

const mapStateToProps = (state, ownProps) => ({
    type_management: state.TypeManagement.items,
    list_announcements: state.Announcements.items,
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobManagement)