import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA } from '../../../../../common/const/actions';
import { Button, Table, Icon, Select, Row, Col, Modal, DatePicker, Rate } from 'antd';
import { timeConverter, momentToUnix } from '../../../../../common/utils/convertTime';
import './MngList.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { TYPE } from '../../../../../common/const/type';
import { Link } from 'react-router-dom';
import { IptLetter } from '../../../layout/common/Common';
let { Option } = Select;

let ImageRender = (props) => {
    return <img src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} />
}

interface MngListProps extends StateProps, DispatchProps {
    match?: any,
    getTypeManagement: Function,
    getAnnoucements: Function,
    getAnnoucementDetail: Function,
}

interface JobMmgtable {
    table_columns: {
        key: any;
        index: number;
        title: string;
        admin: string;
        modifyAdmin: string;
        createdDate: string;
        lastModified: string;
        imageUrl: any;
        hidden: string;
        announcementType: string;
        render: JSX.Element;
    }

}

interface MngListState {
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
    id?: string;
    loading_table?: boolean;
};

class MngList extends PureComponent<MngListProps, MngListState> {
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
            list_announcements: [],
            id: "",
            loading_table: true
        }
    }

    EditJob = (
        <div>
            <Icon style={{ padding: "5px 10px" }} type="delete" theme="twoTone" twoToneColor="red" onClick={() => this.deleteAnnoun()} />
            <Link to={`/admin/job-management/fix/${localStorage.getItem("id_mgm")}`}>
                <Icon style={{ padding: "5px 10px" }} type="edit" theme="twoTone" />
            </Link>
            <Icon key="delete" style={{ padding: "5px 10px" }} type="eye" onClick={() => this.onToggleModal()} />
        </div>
    )

    deleteAnnoun = async () => {
        /* tslint:disable */
        Swal.fire(
            "Worksvn thông báo",
            "Bạn chắc chắn muốn xóa bài viết này",
            "warning",
        ).then(value => {
            console.log(value);
            if (value) {
                // _requestToServer(
                //     DELETE,
                //     [localStorage.getItem("id_mgm")],
                //     ANNOUNCEMENT_DETAIL,
                //     ADMIN_HOST,
                //     authHeaders,
                //     null,
                //     true
                // ).then(res => {
                //     if (res.code === 200) {
                //         this.searchAnnouncement()
                //     }
                // })
            }
        })
    };

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
            width: 80,
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
            className: 'action',
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
            width: 120,
            render: () => this.EditJob
        },
    ];

    onToggleModal = () => {
        let { show_modal } = this.state;

        if (!show_modal) {
            let id = localStorage.getItem("id_mgm");
            this.props.getAnnoucementDetail(id);
        };
        this.setState({ show_modal: !show_modal });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.type_management !== prevState.type_management) {
            return {
                type_management: nextProps.type_management,
                value_type: "Tất cả",
                announcementTypeID: null
            }
        }

        if (nextProps.list_announcements !== prevState.list_announcements) {
            let { pageIndex, pageSize } = prevState;
            let data_table = [];
            nextProps.list_announcements.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) *  (pageSize ? pageSize : 10) + 1),
                    title: item.title,
                    admin: item.admin ? (item.admin.firstName + " " + item.admin.lastName) : "",
                    modifyAdmin: item.modifyAdmin ? (item.modifyAdmin.firstName + " " + item.modifyAdmin.lastName) : "",
                    createdDate: timeConverter(item.createdDate, 1000),
                    lastModified: item.lastModified !== -1 ? timeConverter(item.lastModified, 1000) : "",
                    imageUrl: item.imageUrl ? <ImageRender src={item.imageUrl} alt="Ảnh đại diện" /> : "",
                    hidden: !item.hidden ? "Hiện" : "Ẩn",
                    announcementType: item.announcementType.name,
                });
            })
            return {
                list_announcements: nextProps.type_management,
                data_table,
                loading_table: false,
            }
        } return null;
    }

    async componentDidMount() {
        await this.searchAnnouncement();
    }

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    }

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
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

        await this.props.getAnnoucements({
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

    render() {
        let { data_table, show_modal, type_management, value_type, loading_table } = this.state;
        let { annoucement_detail } = this.props;
        return (
            <Fragment>
                <div className="common-content">
                    <Modal
                        visible={show_modal}
                        title="XEM TRƯỚC BÀI VIẾT"
                        onCancel={this.onToggleModal}
                        style={{ top: "5vh" }}
                        footer={[
                            <Button
                                key="back"
                                type="danger"
                                onClick={this.onToggleModal}
                            >
                                Thoát
                        </Button>
                        ]}
                    >
                        <h5>{annoucement_detail.title}</h5>
                        <div className="annou-edit-modal">
                            <p>
                                <Icon type="user" />
                                <IptLetter value={" " + annoucement_detail.admin.firstName + " " + annoucement_detail.admin.lastName} />
                            </p>
                            <p>
                                <Icon type="calendar" />
                                <IptLetter value={timeConverter(annoucement_detail.createdDate, 1000)} />
                            </p>
                            <Rate disabled defaultValue={4} />
                            <div className="content-edit" dangerouslySetInnerHTML={{ __html: annoucement_detail.content }} />
                        </div>
                    </Modal>

                    <h5>
                        Quản lí bài viết
                        <Button
                            onClick={() => this.searchAnnouncement()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 5px"
                            }}
                        >
                            <Icon type="filter" />
                            Tìm kiếm
                        </Button>
                        <Button
                            onClick={() => this.searchAnnouncement()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 5px"
                            }}
                        >
                            <Link to='/admin/job-management/create' >
                                <Icon type="plus" />
                                Tạo bài viết mới
                            </Link>
                        </Button>
                    </h5>
                    <div className="table-operations">
                        <Row >
                            <Col xs={24} sm={12} md={6} lg={5} xl={6} xxl={6} >
                                <p>
                                    <IptLetter value={"Chọn loại đối tượng"} />
                                </p>
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
                            <Col xs={24} sm={12} md={6} lg={5} xl={6} xxl={6} >
                                <p>
                                    <IptLetter value={"Chọn loại bài đăng"} />
                                </p>
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
                            <Col xs={24} sm={12} md={12} lg={14} xl={12} xxl={8} >
                                <p>
                                    <IptLetter value={"Chọn thời gian đăng bài"} />
                                </p>
                                <DatePicker
                                    placeholder="Chọn ngày tạo bài"
                                    defaultValue={null}
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
                                    style={{ margin: "0px 10px" }}
                                    defaultValue={"Trạng thái"}
                                    onChange={this.onChangeHidden}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={-1}>Đã ẩn</Option>
                                    <Option value={0}>Hiện</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Table<JobMmgtable>
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 1000 }}
                            bordered
                            pagination={{ total: 20 }}
                            size="default"
                            onChange={this.setPageIndex}
                            onRow={(event) => ({ onClick: () => localStorage.setItem("id_mgm", event.key) })}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getTypeManagement: (data) => dispatch({ type: REDUX_SAGA.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT, data }),
    getAnnoucements: (body) => dispatch({ type: REDUX_SAGA.ANNOUNCEMENTS.GET_ANNOUNCEMENTS, body }),
    getAnnoucementDetail: (id) => dispatch({ type: REDUX_SAGA.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, id })
})

const mapStateToProps = (state, ownProps) => ({
    type_management: state.TypeManagement.items,
    list_announcements: state.Announcements.items,
    annoucement_detail: state.AnnouncementDetail.data,
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MngList)