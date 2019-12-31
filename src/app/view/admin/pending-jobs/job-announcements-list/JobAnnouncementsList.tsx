import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA, REDUX } from '../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, Cascader, Checkbox, Tooltip, Modal, message } from 'antd';
import { timeConverter, momentToUnix } from '../../../../../utils/convertTime';
import './JobAnnouncementsList.scss';
import { TYPE } from '../../../../../const/type';
import { Link } from 'react-router-dom';
import { IptLetterP } from '../../../layout/common/Common';
import { IJobAnnouncementsFilter, IJobAnnouncement } from '../../../../../models/job-announcements';
import { IAppState } from '../../../../../redux/store/reducer';
// import { IJobName } from '../../../../../models/job-names';
import { IEmBranch } from '../../../../../models/em-branches';
// import DrawerConfig from '../../../layout/config/DrawerConfig';
import { IJobAnnouncementDetail } from '../../../../../models/job-annoucement-detail';
import { _requestToServer } from '../../../../../services/exec';
import { DELETE, PUT } from '../../../../../const/method';
import {
    // JOB_PRIORITY_HOME, 
    JOB_ANNOUNCEMENTS
} from '../../../../../services/api/private.api';
import { IModalState } from '../../../../../models/mutil-box';
import { IDrawerState } from 'antd/lib/drawer';
import { routeLink, routePath } from '../../../../../const/break-cumb';

let { Option } = Select;
let CheckboxGroup = Checkbox.Group;
const plainOptions = ['Đang chờ', 'Từ chối', 'Chấp nhận'];

const viewCount = (id?: string | number, count?: string | number, color?: "red" | "#1687f2" | "orange", state?: string, icon?: "user" | "user-delete" | "user-add") => (
    <div
        className="n-candidate"
        style={{
            pointerEvents: count === 0 ? 'none' : undefined
        }}
    >
        <Link
            to={routeLink.JOB_ANNOUNCEMENTS + routePath.APPLY + `/${id}?state=${state}`}
            target="_blank"
        >
            <Tooltip title="Xem chi tiết">
                <div style={{ color }}>
                    {count} <Icon type={icon} />
                </div>
            </Tooltip>
        </Link>
    </div >
);

const ViewPriority = (props?: { priority?: string, timeLeft?: string }) => {
    let { priority } = props;
    switch (priority) {
        case TYPE.TOP:
            return (
                <Tooltip title={"Gói tuyển dụng gấp"} placement="left">
                    <div className='top f-sm'>
                        ({props.timeLeft})
                    </div>
                </Tooltip>
            );
        case TYPE.HIGHLIGHT:
            return (
                <Tooltip title={"Gói tìm kiếm nổi bật"} placement="left">
                    <div className='high_light f-sm'>
                        ({props.timeLeft})
                    </div>
                </Tooltip>
            );
        case TYPE.IN_DAY:
            return (
                <Tooltip title={"Gói tuyển dụng trong ngày"} placement="left">
                    <div className='in_day f-sm'>
                        ({props.timeLeft})
                    </div>
                </Tooltip>
            );
        default:
            return <span></span>
    }

}

interface IJobAnnouncementsListProps extends StateProps, DispatchProps {
    match?: any;
    getListJobAnnouncements: Function;
    getListEmBranches: Function;
    getTypeManagement: Function;
    getJobAnnouncementDetail: (id?: string) => any;
    getListJobService: Function;
    handleDrawer: Function;
    handleModal: Function;
};

interface IJobAnnouncementsListState {
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    employerID?: string;
    target?: string;
    jobNameID?: string;
    jobId?: string;
    show_modal?: boolean;
    loading?: boolean;
    message?: string;
    list_em_branches?: Array<any>;
    value_type?: string;
    announcementTypeID?: number;
    createdDate?: number;
    adminID?: string;
    hidden?: boolean;
    list_job_announcements?: Array<any>;
    id?: string;
    loading_table?: boolean;
    body?: IJobAnnouncementsFilter;
    un_checkbox?: boolean;
    list_check?: Array<any>;
    state_check_box?: Array<string>;
    open_drawer?: boolean;
    homePriority?: string;
    searchPriority?: string;
    homeExpired: boolean;
    searchExpired: boolean;
    job_announcement_detail: IJobAnnouncementDetail;
    type_modal: string;
};


class JobAnnouncementsList extends PureComponent<IJobAnnouncementsListProps, IJobAnnouncementsListState> {
    constructor(props) {
        super(props);
        this.state = {
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            employerID: null,
            jobNameID: null,
            jobId: null,
            show_modal: false,
            loading: false,
            message: null,
            list_em_branches: [],
            value_type: null,
            announcementTypeID: null,
            createdDate: null,
            adminID: null,
            hidden: false,
            list_job_announcements: [],
            id: null,
            loading_table: true,
            body: {
                expired: null,
                hidden: null,
                jobType: null,
                homePriority: null,
                homeExpired: null,
                searchPriority: null,
                searchExpired: null,
                excludedJobIDs: null,
                jobNameIDs: null,
                jobGroupIDs: null,
                hasPendingApplied: null,
                hasAcceptedApplied: null,
                hasRejectedApplied: null,
                jobShiftFilter: null,
                jobLocationFilter: null
            },

            un_checkbox: false,
            list_check: [],
            homePriority: null,
            searchPriority: null,
            homeExpired: false,
            searchExpired: false,
            job_announcement_detail: null,
            type_modal: null,
        };
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
            dataIndex: 'title',
            key: 'jobTitle',
        },

        {
            title: 'Tên công việc',
            dataIndex: 'jobName',
            key: 'jobName',
            width: 200,
        },
        {
            title: 'Đang chờ',
            dataIndex: 'pendingApplied',
            className: 'action',
            key: 'pendingApplied',
            width: 100,
        },
        {
            title: 'Đã chấp nhận',
            dataIndex: 'acceptedApplied',
            className: 'action',
            key: 'acceptedApplied',
            width: 100,
        },
        {
            title: 'Từ chối',
            dataIndex: 'rejectedApplied',
            className: 'action',
            key: 'rejectedApplied',
            width: 100,
        },
        {
            title: 'Chi nhánh',
            dataIndex: 'employerBranchName',
            key: 'employerBranchName',
            width: 200,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'hidden',
            className: 'action',
            key: 'hidden',
            width: 100,
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
            title: 'Ngày hết hạn',
            dataIndex: 'expirationDate',
            className: 'action',
            key: 'expirationDate',
            width: 100,
        },

        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            className: 'action',
            key: 'priority',
            width: 190,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            dataIndex: 'operation',
            width: 100,
        }
    ];

    options = [
        {
            value: TYPE.JOB_FILTER.homePriority,
            label: 'Trang chủ ',
            children: [
                {
                    value: TYPE.TOP,
                    label: 'Tuyển gấp',
                },
                {
                    value: 'IN_DAY',
                    label: 'Trong ngày',
                }
            ],
        },
        {
            value: TYPE.JOB_FILTER.searchPriority,
            label: 'Tìm kiếm',
            children: [
                {
                    value: TYPE.HIGHLIGHT,
                    label: 'Nổi bật',
                },
            ],
        },
    ];

    onToggleModal = () => {
        let { show_modal } = this.state;
        this.setState({ show_modal: !show_modal });
    };

    static getDerivedStateFromProps(nextProps: IJobAnnouncementsListProps, prevState: IJobAnnouncementsListState) {
        if (
            nextProps.list_job_announcements &&
            nextProps.list_job_announcements !== prevState.list_job_announcements
        ) {
            let { pageIndex, pageSize } = prevState;
            let data_table = [];


            let EditToolTip = (hidden?: boolean, id?: string) => (
                <>
                    <Tooltip placement="topLeft" title={hidden ? "Hiện bài đăng" : "Ẩn bài đăng"}>
                        <Icon
                            className='test'
                            type={hidden ? "eye-invisible" : "eye"}
                            style={{ padding: "5px 5px", color: hidden ? "black" : "gray", margin: 2 }}
                            onClick={async () => await _requestToServer(
                                PUT,
                                JOB_ANNOUNCEMENTS + `/${id}/hidden/${!hidden}`,
                                undefined,
                                undefined,
                                undefined,
                                undefined,
                                false,
                                false
                            ).then((res: any) => {
                                if (res) {
                                    setTimeout(() => {
                                        nextProps.getListJobAnnouncements(prevState.body, prevState.pageIndex, prevState.pageSize);
                                    }, 250);
                                    message.success("Thành công", 2);
                                }
                            })}
                        />
                    </Tooltip>
                    {/* <Tooltip placement="topRight" title={"Kích hoạt gói dịch vụ"}>
                        <Icon
                            className='test'
                            type="dollar"
                            style={{ padding: "5px 5px", color: "orange", margin: 2 }}
                            onClick={async () => {
                                await nextProps.handleDrawer();
                                await setTimeout(() => { nextProps.getJobAnnouncementDetail(id) }, 250)
                            }} />
                    </Tooltip>
                    <Tooltip placement="top" title={"Xem chi tiết(sửa)"}>
                        <Link to={routeLink.JOB_ANNOUNCEMENTS + routePath.FIX + `/${id}`} target="_blank">
                            <Icon
                                className='test'
                                style={{ padding: "5px 5px", margin: 2 }}
                                type="edit"
                                theme="twoTone"
                                twoToneColor="green"
                            />
                        </Link>
                    </Tooltip>
                    <Tooltip placement="top" title={"Đăng bài tương tự"}>
                        <Link to={routeLink.JOB_ANNOUNCEMENTS + routePath.COPY + `/${id}`} target="_blank">
                            <Icon
                                className='test'
                                style={{ padding: "5px 5px", margin: 2 }}
                                type="copy"
                                theme="twoTone"
                            />
                        </Link>
                    </Tooltip> */}
                    <Tooltip placement="topRight" title={"Xóa bài đăng"}>
                        <Icon
                            className='test'
                            style={{ padding: "5px 5px", margin: 2 }}
                            type="delete"
                            theme="twoTone"
                            twoToneColor="red"
                            onClick={() => nextProps.handleModal({ msg: "Bạn muốn xóa bài đăng này", type_modal: TYPE.DELETE })}
                        />
                    </Tooltip>
                </>
            )

            nextProps.list_job_announcements.forEach((item: IJobAnnouncement, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    title: item.jobTitle,
                    jobName: item.jobName.name ? item.jobName.name : "",
                    jobType: item.jobType,
                    employerBranchName: item.employerBranchName ? item.employerBranchName : "",
                    createdDate: timeConverter(item.createdDate, 1000),
                    expirationDate: timeConverter(item.expirationDate, 1000),
                    acceptedApplied: viewCount(item.id, item.acceptedApplied, "#1687f2", TYPE.ACCEPTED, "user-add"),
                    rejectedApplied: viewCount(item.id, item.rejectedApplied, "red", TYPE.REJECTED, "user-delete"),
                    pendingApplied: viewCount(item.id, item.pendingApplied, "orange", TYPE.PENDING, "user"),
                    hidden: `${!item.hidden ? "Hiện" : "Ẩn"}, ${!item.expired ? "Còn hạn" : "Hết hạn"}`,
                    priority:
                        <>
                            <ViewPriority priority={item.priority.homePriority} timeLeft={item.priority.homeTimeLeft} />
                            <ViewPriority priority={item.priority.searchPriority} timeLeft={item.priority.searchTimeLeft} />
                        </>,
                    operation: EditToolTip(item.hidden, item.id)
                });
            })

            return {
                list_job_announcements: nextProps.list_job_announcements,
                data_table,
                loading_table: false,
            }
        }

        if (
            nextProps.job_announcement_detail &&
            nextProps.job_announcement_detail !== prevState.job_announcement_detail
        ) {
            let { job_announcement_detail } = nextProps;
            return {
                homePriority: job_announcement_detail.priority.homePriority,
                searchPriority: job_announcement_detail.priority.searchPriority,
                homeExpired: job_announcement_detail.priority.homeExpired,
                searchExpired: job_announcement_detail.priority.searchExpired,
                job_announcement_detail
            }
        }

        return {
            loading_table: false
        };
    };

    async componentDidMount() {
        await this.props.getListEmBranches();
        await this.searchJobAnnouncement();
    };

    onChoseHomePriority = (event: any) => {
        this.setState({ homePriority: event });
    };

    onChoseSearchPriority = (event: any) => {
        this.setState({ searchPriority: event });
    };

    onCancelRegisterBenefit = () => {
        this.props.handleDrawer();
        this.setState({
            homePriority: null,
            searchPriority: null
        })
    }

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    handleCheckBox = (event: any) => {
        let { body } = this.state;
        let list_param = [
            { label: "Đang chờ", param: TYPE.JOB_FILTER.hasPendingApplied },
            { label: "Từ chối", param: TYPE.JOB_FILTER.hasRejectedApplied },
            { label: "Chấp nhận", param: TYPE.JOB_FILTER.hasAcceptedApplied },
        ]
        if (typeof event === "boolean") {
            if (event) {
                body.hasAcceptedApplied = null;
                body.hasPendingApplied = null;
                body.hasRejectedApplied = null;
            }
        } else {
            body.hasAcceptedApplied = null;
            body.hasPendingApplied = null;
            body.hasRejectedApplied = null;
            event.forEach((element: string) => {
                let arr = list_param.filter((item: any, index: number) => {
                    return (item.label === element)
                });

                arr.forEach((item: any, index) => {
                    body[item.param] = true;
                });
            });
        }

        this.setState({ body });
    }

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchJobAnnouncement();
    };

    searchJobAnnouncement = async () => {
        let { body, pageIndex, pageSize } = this.state;
        await this.props.getListJobAnnouncements(body, pageIndex, pageSize);
    };

    onChangeType = (event: any, param?: string) => {
        let { body } = this.state;
        let { list_em_branches } = this.props;
        let value: any = event;
        switch (param) {
            case TYPE.JOB_FILTER.jobNameIDs:
                value = [value];
                break;
            case TYPE.JOB_FILTER.jobLocationFilter:
                if (value) {
                    let data = list_em_branches.filter((item: IEmBranch, index: number) => { return item.id === event });
                    value = { distance: 1, lat: data[0].lat, lon: data[0].lon }
                }
                break;
            default:
                break;
        }

        switch (event) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
                break;
            default:
                break;
        }

        body[param] = value;
        this.setState({ body });
    };

    onChangeCreatedDate = (event) => {
        this.setState({ createdDate: momentToUnix(event) });
    };

    onChangeHidden = (event) => {
        let { hidden } = this.state;
        switch (event) {
            case 0:
                hidden = true;
                break;
            case -1:
                hidden = false;
                break;
            default:
                break;
        };
        this.setState({ hidden });
    };

    createRequest = async () => {
        let {
            // homePriority, 
            // searchPriority, 
            id
        } = this.state;
        let { modalState } = this.props;
        await this.setState({ loading: true });
        switch (modalState.type_modal) {
            // case TYPE.JOB_FILTER.homePriority:
            //     await _requestToServer(
            //         POST,
            //         JOB_PRIORITY_HOME + `/${id}/priority/home`,
            //         { homePriority },
            //         undefined,
            //         undefined,
            //         undefined,
            //         true,
            //         false
            //     ).then((res: any) => {
            //         if (res) {
            //             this.requeryData()
            //         }
            //     }).finally(
            //         () => this.setState({
            //             loading: false
            //         })
            //     );
            //     break;

            // case TYPE.JOB_FILTER.searchPriority:
            //     await _requestToServer(
            //         POST,
            //         JOB_PRIORITY_HOME + `/${id}/priority/search`,
            //         { searchPriority },
            //         undefined,
            //         undefined,
            //         undefined,
            //         true,
            //         false
            //     ).then((res: any) => {
            //         if (res) {
            //             this.requeryData()
            //         }
            //     }).finally(
            //         () => this.setState({
            //             loading: false
            //         })
            //     );
            //     break;

            case TYPE.DELETE:
                await _requestToServer(
                    DELETE,
                    JOB_ANNOUNCEMENTS + `/${id}`,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    true,
                    false
                ).then((res) => {
                    if (res) {
                        this.searchJobAnnouncement();
                        this.props.handleModal();
                    }
                }).finally(
                    () => this.setState({
                        loading: false
                    })
                )
                break;
            default:
                break;
        };
    }

    requeryData = async () => {
        let { id } = this.state;
        await this.searchJobAnnouncement();
        await this.props.getListJobService();
        await this.props.getJobAnnouncementDetail(id);
        await this.props.handleModal();
    }

    render() {
        let {
            data_table,
            value_type,
            loading_table,
            un_checkbox,
            list_check,
            // homePriority,
            // searchPriority,
            // homeExpired,
            // searchExpired,
            body,
            loading,
        } = this.state;

        let {
            // job_announcement_detail,
            totalItems,
            list_job_names,
            list_em_branches,
            // list_job_service,
            modalState
        } = this.props;

        // let homeExpiration = job_announcement_detail.priority.homeExpiration;
        // let searchExpiration = job_announcement_detail.priority.searchExpiration;
        // let un_active_home = homeExpiration !== -1 && !homeExpired;
        // let un_active_search = searchExpiration !== -1 && !searchExpired;

        return (
            <>
                <Modal
                    visible={modalState.open_modal}
                    title={"Workvn thông báo"}
                    destroyOnClose={true}
                    onOk={this.createRequest}
                    onCancel={() => {
                        this.setState({ message: null, loading: false });
                        this.props.handleModal();
                    }}
                    footer={[
                        <Button
                            key="cancel"
                            children="Hủy"
                            onClick={() => {
                                this.setState({
                                    message: null,
                                    loading: false
                                });

                                this.props.handleModal()
                            }}
                        />,
                        <Button
                            key="ok"
                            type={modalState.type_modal === TYPE.DELETE ? "danger" : "primary"}
                            icon={modalState.type_modal === TYPE.DELETE ? "delete" : "check"}
                            loading={loading}
                            children={modalState.type_modal === TYPE.DELETE ? "Xóa" : "Xác nhận"}
                            onClick={async () => this.createRequest()}
                        />
                    ]}
                    children={modalState.msg}
                />
                <>
                    {/* <DrawerConfig
                        title={"Kích hoạt gói dịch vụ tuyển dụng"}
                        width={800}
                    >
                        <h6>Các gói của bạn</h6>
                        <>
                            <label className='top'>Gói tuyển dụng gấp: {list_job_service.homeTopQuantiy}</label>
                            <label className='in_day'>Gói tuyển dụng trong ngày: {list_job_service.homeInDayQuantity}</label>
                            <label className='high_light'>Gói tìm kiếm nổi bật:  {list_job_service.searchHighLightQuantity}</label>
                        </>
                        <hr />
                        <h6>Hãy chọn gói phù hợp cho bạn <Icon type="check" style={{ color: "green" }} /></h6>
                        <>
                            <IptLetterP
                                style={{ margin: "15px 5px" }}
                                value={`Nhóm gói tuyển dụng ở trang chủ${homeExpiration !== -1 && homeExpired ? "(Hết hạn)" : ""}`}
                            >
                                <Radio.Group onChange={
                                    (event: any) => this.onChoseHomePriority(event.target.value)}
                                    value={homePriority}
                                    disabled={un_active_home}
                                >
                                    <Radio value={TYPE.TOP}>Tuyển dụng gấp</Radio>
                                    <Radio value={TYPE.IN_DAY}>Tuyển dụng trong ngày</Radio>
                                </Radio.Group>
                                <Button
                                    icon="check"
                                    type={un_active_home ? "ghost" : "primary"}
                                    style={{
                                        float: "right"
                                    }}
                                    disabled={un_active_home}
                                    onClick={() => {
                                        this.props.handleModal({
                                            msg: "Bạn muốn kích hoạt gói dịch vụ cho bài đăng này ?",
                                            type_modal: TYPE.JOB_FILTER.homePriority
                                        });
                                    }}
                                >
                                    Kích hoạt
                            </Button>
                            </IptLetterP>
                            <IptLetterP
                                style={{ margin: "15px 5px" }}
                                value={`Nhóm gói tuyển dụng tìm kiếm" ${searchExpiration !== -1 && searchExpired ? "(Hết hạn)" : ""}`}
                            >
                                <Radio.Group onChange={
                                    (event: any) => this.onChoseSearchPriority(event.target.value)}
                                    value={searchPriority}
                                    disabled={un_active_search}
                                >
                                    <Radio value={TYPE.HIGHLIGHT}>Tìm kiếm nổi bật</Radio>
                                </Radio.Group>
                                <Button
                                    type={un_active_search ? "ghost" : "primary"}
                                    icon="check"
                                    style={{
                                        float: "right"
                                    }}
                                    disabled={un_active_search}
                                    onClick={() => {
                                        this.props.handleModal({
                                            msg: "Bạn muốn kích hoạt gói dịch vụ cho bài đăng này ?",
                                            type_modal: TYPE.JOB_FILTER.searchPriority
                                        });
                                    }}
                                >
                                    Kích hoạt
                            </Button>
                            </IptLetterP>
                        </>
                        <div style={{
                            marginTop: "30px",
                            textAlign: "center",
                        }}
                        >
                            {
                                (!homeExpired && homeExpiration !== -1) ||
                                    (!searchExpired && homeExpiration !== -1) ?
                                    <span className="italic">(Đang kích hoạt gói dịch vụ)</span> :
                                    <span className="italic"> (Chưa kích hoạt gói dịch vụ)</span>
                            }
                        </div>
                        <hr />
                        <div style={{ padding: "40px 10px 20px ", width: "100%" }}>
                            <Button
                                icon="close"
                                type="dashed"
                                style={{
                                    float: "left"
                                }}
                                onClick={() => this.onCancelRegisterBenefit()}
                            >
                                Hủy bỏ thay đổi
                        </Button>

                        </div>
                    </DrawerConfig> */}
                    <div className="common-content">
                        <h5>
                            Quản lý bài đăng
                                <Button
                                onClick={() => this.searchJobAnnouncement()}
                                type="primary"
                                style={{
                                    float: "right",
                                    margin: "0px 10px",
                                }}
                                icon={loading_table ? "loading" : "search"}
                                children="Tìm kiếm"
                            />
                            <Link to={routeLink.PENDING_JOBS + routePath.CREATE} >
                                <Button
                                    type="primary"
                                    style={{
                                        float: "right",
                                        margin: "0px 10px",
                                    }}
                                    icon={"plus"}
                                    children="Tạo bài đăng mới"
                                />
                            </Link>
                        </h5>
                        <div className="table-operations">
                            <Row >
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Trạng thái hoạt động"} />
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) => this.onChangeType(event, TYPE.JOB_FILTER.expired)}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={TYPE.FALSE}>Còn hạn</Option>
                                        <Option value={TYPE.TRUE}>Hết hạn</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Tên việc đăng tuyển"} />
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) => this.onChangeType(event, TYPE.JOB_FILTER.jobNameIDs)}
                                    >
                                        {
                                            list_job_names &&
                                            list_job_names.map(
                                                (item: any, index: number) => <Option key={index} value={item.id}>{item.name}</Option>
                                            )
                                        }
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Chi nhánh"} />
                                    <Select
                                        showSearch
                                        placeholder="Tất cả"
                                        optionFilterProp="children"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) => this.onChangeType(event, TYPE.JOB_FILTER.jobLocationFilter)}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        {
                                            list_em_branches &&
                                            list_em_branches.map(
                                                (item: IEmBranch, index: number) => <Option key={index} value={item.id}>{item.branchName}</Option>
                                            )
                                        }
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Loại công việc"} />
                                    <Select
                                        showSearch
                                        placeholder="Tất cả"
                                        defaultValue="Tất cả"
                                        optionFilterProp="children"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) => this.onChangeType(event, TYPE.JOB_FILTER.jobType)}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={TYPE.FULLTIME}>Toàn thời gian</Option>
                                        <Option value={TYPE.PARTTIME}>Bán thời gian</Option>
                                        <Option value={TYPE.INTERNSHIP}>Thực tập sinh</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Gói dịch vụ"} />
                                    <Cascader
                                        placeholder="Không chọn gói"
                                        style={{ width: "100%" }}
                                        options={this.options}
                                        onChange={
                                            (event: any) => {
                                                if (event.length === 0) {
                                                    body.homePriority = null;
                                                    body.searchPriority = null;
                                                    this.setState({ body });
                                                } else this.onChangeType(event[1], event[0]);
                                            }
                                        }
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Trạng thái gói dịch vụ"} />
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        placeholder="Tất cả"
                                        optionFilterProp="children"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) => this.onChangeType(event, TYPE.JOB_FILTER.expired)}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={TYPE.TRUE}>Còn hạn</Option>
                                        <Option value={TYPE.FALSE}>Hết hạn</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Trạng thái ẩn/hiện"} />
                                    <Select
                                        showSearch
                                        placeholder="Tất cả"
                                        defaultValue="Tất cả"
                                        optionFilterProp="children"
                                        style={{ width: "100%" }}
                                        value={value_type}
                                        onChange={(event: any) => this.onChangeType(event, TYPE.JOB_FILTER.hidden)}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={TYPE.TRUE}>Đang ẩn</Option>
                                        <Option value={TYPE.FALSE}>Đang hiện</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Chứa trạng thái ứng tuyển"} />
                                    <Checkbox
                                        indeterminate={un_checkbox}
                                        onChange={
                                            (event: any) => {
                                                this.handleCheckBox(event.target.checked);
                                                this.setState({ un_checkbox: event.target.checked })
                                            }
                                        }
                                    >
                                        Bất kì
                                </Checkbox>
                                    <hr />
                                    <CheckboxGroup
                                        options={plainOptions}
                                        value={list_check}
                                        onChange={
                                            (event: any) => {
                                                this.handleCheckBox(event);
                                                this.setState({ list_check: event })
                                            }
                                        }
                                        disabled={un_checkbox}
                                    />
                                </Col>
                            </Row>
                            <Table
                                // @ts-ignore
                                columns={this.columns}
                                loading={loading_table}
                                dataSource={data_table}
                                scroll={{ x: 1800 }}
                                bordered
                                pagination={{ total: totalItems, showSizeChanger: true }}
                                size="middle"
                                onChange={this.setPageIndex}
                                onRow={(record: any, rowIndex: any) => {
                                    return {
                                        onClick: (event: any) => {
                                            this.setState({ id: record.key })
                                        }, // mouse enter row
                                    };
                                }}
                            />
                        </div>
                    </div>
                </>
            </>
        )
    }
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListJobAnnouncements: (body: IJobAnnouncementsFilter, pageIndex: number, pageSize: number) =>
        dispatch({ type: REDUX_SAGA.JOB_ANNOUNCEMENTS.GET_JOB_ANNOUNCEMENTS, body, pageIndex, pageSize }),
    getListEmBranches: () =>
        dispatch({ type: REDUX_SAGA.EM_BRANCHES.GET_EM_BRANCHES }),
    handleDrawer: (drawerState?: IDrawerState) =>
        dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
    handleModal: (modalState?: IModalState) =>
        dispatch({ type: REDUX.HANDLE_MODAL, modalState }),
    getJobAnnouncementDetail: (id?: string) =>
        dispatch({ type: REDUX_SAGA.JOB_ANNOUNCEMENT_DETAIL.GET_JOB_ANNOUNCEMENT_DETAIL, id }),
    // getListJobService: () => dispatch({ type: REDUX_SAGA.JOB_SERVICE.GET_JOB_SERVICE }),
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    list_job_announcements: state.JobAnnouncements.items,
    list_job_names: state.JobNames.items,
    list_em_branches: state.EmBranches.items,
    // list_job_service: state.JobService,
    job_announcement_detail: state.JobAnnouncementDetail,
    modalState: state.MutilBox.modalState,
    drawerState: state.MutilBox.drawerState,
    totalItems: state.JobAnnouncements.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobAnnouncementsList);