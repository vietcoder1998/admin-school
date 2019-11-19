import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA } from '../../../../../common/const/actions';
import { Button, Table, Icon, Select, Row, Col, Modal, DatePicker, Rate } from 'antd';
import { timeConverter, momentToUnix } from '../../../../../common/utils/convertTime';
import './MngList.scss';
import { TYPE } from '../../../../../common/const/type';
import { Link } from 'react-router-dom';
import { IptLetter } from '../../../layout/common/Common';
import { ModalConfig } from '../../../layout/modal-config/ModalConfig';
import { _requestToServer } from '../../../../../services/exec';
import { DELETE } from '../../../../../common/const/method';
import { ANNOUNCEMENT_DETAIL } from '../../../../../services/api/private.api';

let { Option } = Select;

let ImageRender = (props: any) => {
    if (props.src && props.src !== "") {
        return <img src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} />
    } else {
        return <div style={{ width: "60px", height: "60px", padding: "20px 0px" }}>
            <Icon type="area-chart" />
        </div>
    }
};

interface MngListProps extends StateProps, DispatchProps {
    match?: any,
    history?: any,
    getListTypeManagement: Function,
    getAnnouncements: Function,
    getAnnouncementDetail: Function,
}

interface JobMmgtable {
    table_columns: {
        key?: string;
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
    list_annou_types?: Array<any>;
    value_type?: string;
    announcementTypeID?: number;
    createdDate?: number;
    adminID?: string;
    hidden?: boolean;
    list_announcements?: Array<any>;
    id?: string;
    loading_table?: boolean;
    open_config_modal?: boolean;
}

class MngList extends PureComponent<MngListProps, MngListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            target: undefined,
            list_annou_types: [],
            announcementTypeID: undefined,
            createdDate: undefined,
            adminID: undefined,
            hidden: undefined,
            pageIndex: 0,
            list_announcements: [],
            id: "",
            loading_table: true
        }
    }

    EditJob = (
        <React.Fragment>
            <Icon style={{ padding: "5px 10px" }} type="delete" theme="twoTone" twoToneColor="red"
                onClick={() => this.toggleModalConfig()} />
            <Icon style={{ padding: "5px 10px" }} type="edit" theme="twoTone" onClick={() => this.toFixJob()} />
            <Icon key="delete" style={{ padding: "5px 10px" }} type="eye" onClick={() => this.onToggleModal()} />
        </React.Fragment>
    );

    toFixJob = () => {
        let id = localStorage.getItem('id_mgm');
        this.props.history.push(`/admin/job-management/fix/${id}`);
    };

    deleteAnnouncements = async () => {
        _requestToServer(
            DELETE, ANNOUNCEMENT_DETAIL,
            [localStorage.getItem("id_mgm")],
        ).then((res: any) => {
            this.searchAnnouncement();
        });

        this.toggleModalConfig();
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
            width: 100,
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
            width: 160,
            render: () => this.EditJob
        },
    ];

    onToggleModal = () => {
        let { show_modal } = this.state;
        if (!show_modal) {
            let id = localStorage.getItem("id_mgm");
            this.props.getAnnouncementDetail(id);
        }
        this.setState({ show_modal: !show_modal });
    };

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_annou_types !== prevState.list_annou_types) {
            return {
                list_annou_types: nextProps.list_annou_types,
                value_type: "Tất cả",
                announcementTypeID: null
            }
        }

        if (nextProps.list_announcements !== prevState.list_announcements) {
            let { pageIndex, pageSize } = prevState;
            let data_table: any = [];
            nextProps.list_announcements.forEach((item: any, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    title: item.title,
                    admin: item.admin ? (item.admin.firstName + " " + item.admin.lastName) : "",
                    modifyAdmin: item.modifyAdmin ? (item.modifyAdmin.firstName + " " + item.modifyAdmin.lastName) : "",
                    createdDate: timeConverter(item.createdDate, 1000),
                    lastModified: item.lastModified !== -1 ? timeConverter(item.lastModified, 1000) : "",
                    imageUrl: <ImageRender src={item.imageUrl} alt="Ảnh đại diện" />,
                    hidden: !item.hidden ? "Hiện" : "Ẩn",
                    announcementType: item.announcementType.name,
                });
            });
            return {
                list_announcements: nextProps.list_annou_types,
                data_table,
                loading_table: false,
            }
        }
        return null;
    }

    async componentDidMount() {
        await this.searchAnnouncement();
    }

    handleId = (event: any) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchAnnouncement();
    };

    searchAnnouncement = async () => {
        let {
            pageIndex,
            pageSize,
            createdDate,
            adminID,
            announcementTypeID,
            hidden,
            target,
        } = this.state;
        await this.props.getAnnouncements(
            pageIndex,
            pageSize,
            {
                createdDate,
                adminID,
                announcementTypeID,
                hidden,
                target
            }
        );
    };

    onChangeTarget = (event: any) => {
        this.setState({ target: event });
        this.props.getListTypeManagement({ target: event });
    };

    onChangeJobName = (event: any) => {
        this.setState({ jobNameID: event })
    };

    onChangeType = (event: any) => {
        let { list_annou_types } = this.state;
        if (event === null) {
            this.setState({ announcementTypeID: undefined, value_type: undefined })
        } else if (list_annou_types) {
            list_annou_types.forEach(item => {
                if (item.id === event) {
                    this.setState({ value_type: item.name, announcementTypeID: item.id })
                }
            })
        }
    };

    onChangeCreatedDate = (event: any) => {
        this.setState({ createdDate: momentToUnix(event) })
    };

    onChangeHidden = (event: any) => {
        let { hidden } = this.state;
        switch (event) {
            case 0:
                hidden = true;
                break;
            case -1:
                hidden = false;
                break;
            default:
                hidden = undefined;
                break;
        }
        this.setState({ hidden })
    };

    toggleModalConfig = () => {
        let { open_config_modal } = this.state;
        if (!open_config_modal) {
            let id = localStorage.getItem("id_mgm");
            this.props.getAnnouncementDetail(id);
        }
        this.setState({ open_config_modal: !open_config_modal });
    };

    render() {
        let { data_table, show_modal, list_annou_types, value_type, loading_table, open_config_modal } = this.state;
        let { annoucement_detail, totalItems } = this.props;
        return (
            <Fragment>
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
                            <IptLetter
                                value={" " + annoucement_detail.admin.firstName + " " + annoucement_detail.admin.lastName} />
                        </p>
                        <p>
                            <Icon type="calendar" />
                            <IptLetter value={timeConverter(annoucement_detail.createdDate, 1000)} />
                        </p>
                        <Rate disabled defaultValue={4} />
                        <div className="content-edit" dangerouslySetInnerHTML={{ __html: annoucement_detail.content }} />
                    </div>
                </Modal>
                <ModalConfig
                    title={"Xoá bài viết"}
                    namebtn1="Hủy"
                    namebtn2={"Xóa"}
                    isOpen={open_config_modal}
                    toggleModal={() => {
                        this.setState({ open_config_modal: !open_config_modal })
                    }}
                    handleOk={async () => this.deleteAnnouncements()}
                    handleClose={async () => this.toggleModalConfig()}
                >
                    <div>
                        Bạn muốn xóa bài viết: <IptLetter value={annoucement_detail.title} />
                    </div>
                </ModalConfig>
                <div className="common-content">


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
                            <Link to='/admin/job-management/create'>
                                <Icon type="plus" />
                                Tạo bài viết mới
                            </Link>
                        </Button>
                    </h5>
                    <div className="table-operations">
                        <Row>
                            <Col xs={24} sm={12} md={6} lg={5} xl={6} xxl={6}>
                                <p>
                                    <IptLetter value={"Chọn loại đối tượng"} />
                                </p>
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={this.onChangeTarget}
                                >
                                    <Option value={undefined}>Tất cả</Option>
                                    <Option value={TYPE.SCHOOL}>Nhà trường</Option>
                                    <Option value={TYPE.EMPLOYER}>Nhà tuyển dụng</Option>
                                    <Option value={TYPE.CANDIDATE}>Ứng viên</Option>
                                    <Option value={TYPE.STUDENT}>Học sinh </Option>
                                    <Option value={TYPE.PUBLIC}>Public</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={6} lg={5} xl={6} xxl={6}>
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
                                    <Option value={undefined}>Tất cả</Option>
                                    {
                                        list_annou_types &&
                                        list_annou_types.map((item, index) => <Option key={index}
                                            value={item.id}>{item.name}</Option>)
                                    }
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={14} xl={12} xxl={8}>
                                <p>
                                    <IptLetter value={"Chọn thời gian đăng bài"} />
                                </p>
                                <DatePicker
                                    placeholder="ex: 02/05/2019"
                                    defaultValue={undefined}
                                    onChange={this.onChangeCreatedDate}
                                    format={'DD/MM/YYYY'}
                                />

                                <Select
                                    showSearch
                                    style={{ margin: "0px 10px" }}
                                    defaultValue={"Trạng thái"}
                                    onChange={this.onChangeHidden}
                                >
                                    <Option value={undefined}>Tất cả</Option>
                                    <Option value={0}>Đã ẩn</Option>
                                    <Option value={-1}>Hiện</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 1000 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => {
                                    }, // click row
                                    onMouseEnter: (event) => {
                                        localStorage.setItem('id_mgm', record.key)
                                    }, // mouse enter row
                                };
                            }}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListTypeManagement: (data: any) => dispatch({ type: REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES, data }),
    getAnnouncements: (pageIndex: number, pageSize: number, body: any) => dispatch({
        type: REDUX_SAGA.ANNOUNCEMENTS.GET_ANNOUNCEMENTS,
        pageIndex,
        pageSize,
        body
    }),
    getAnnouncementDetail: (id: string) => dispatch({ type: REDUX_SAGA.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, id })
});

const mapStateToProps = (state: any, ownProps: any) => ({
    list_annou_types: state.AnnouTypes.items,
    list_announcements: state.Announcements.items,
    annoucement_detail: state.AnnouncementDetail.data,
    totalItems: state.Announcements.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MngList)