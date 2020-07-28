import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA, REDUX } from '../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, Cascader, Checkbox, Tooltip, Modal, Radio, Empty, Popconfirm } from 'antd';
import { timeConverter, momentToUnix } from '../../../../../utils/convertTime';
import './JobAnnouncementsList.scss';
import { TYPE } from '../../../../../const/type';
import { Link } from 'react-router-dom';
import { IptLetterP } from '../../../layout/common/Common';
import { IJobAnnouncementsFilter, IJobAnnouncement } from '../../../../../models/job-announcements';
import { IAppState } from '../../../../../redux/store/reducer';
// import { IJobName } from '../../../../../models/job-names';
import { IEmBranch } from '../../../../../models/em-branches';
import DrawerConfig from '../../../layout/config/DrawerConfig';
import { IJobAnnouncementDetail } from '../../../../../models/job-annoucement-detail';
import { _requestToServer } from '../../../../../services/exec';
import { DELETE, POST } from '../../../../../const/method';
import {
    JOB_ANNOUNCEMENTS,
    EM_CONTROLLER
} from '../../../../../services/api/private.api';
import { IModalState } from '../../../../../models/mutil-box';
import { IDrawerState } from 'antd/lib/drawer';
import { routeLink, routePath } from '../../../../../const/break-cumb';
import { IEmController } from '../../../../../models/em-controller';
import { IEmployer } from '../../../../../models/employers';
import JobDetail from '../../../layout/job-detail/JobDetail';
import JobSuitableCandidate from '../../../layout/job-suitable-candidate/JobSuitableCandidate';
import CandidatetInfo from '../../../layout/candidate-info/CandidatetInfo';
import Search from 'antd/lib/input/Search';

let { Option } = Select;
let CheckboxGroup = Checkbox.Group;
const plainOptions = ['Đang chờ', 'Từ chối', 'Chấp nhận'];

function viewCount(
    id?: string | number,
    count?: string | number,
    color?: "red" | "#1687f2" | "orange",
    state?: string,
    icon?: "user" | "user-delete" | "user-add" | "eye",
    type?: "Đang chờ" | "Từ Chối" | "Chấp nhận"
) {
    return (
        < div
            className="n-candidate test"
            style={{
                pointerEvents: count === 0 ? 'none' : undefined,
                padding: 5,
                margin: 2,
                width: 45,
                height: 30,
                display: "inline-block"
            }}
        >
            <Link
                to={routeLink.JOB_ANNOUNCEMENTS + routePath.APPLY + `/${id}?state=${state}`}
                target="_blank"
            >
                <Tooltip title={`Xem chi tiết (${type})`}>
                    <div style={{ color: count === 0 ? "gray" : color }}>
                        {count} <Icon type={icon} />
                    </div>
                </Tooltip>
            </Link>
        </div >);
};

const ViewPriority = (props?: { priority?: string, timeLeft?: string | number }) => {
    let { priority, timeLeft } = props;
    let ntimeLeft = timeLeft && timeLeft !== -1 ? timeLeft : "Hết hạn"
    switch (priority) {
        case TYPE.TOP:
            return (
                <Tooltip title={"Gói tuyển dụng gấp"} placement="left">
                    <div className='top f-sm'>
                        {ntimeLeft}
                    </div>
                </Tooltip>
            );
        case TYPE.HIGHLIGHT:
            return (
                <Tooltip title={"Gói tìm kiếm nổi bật"} placement="left">
                    <div className='high_light f-sm'>
                        {ntimeLeft}
                    </div>
                </Tooltip>
            );
        case TYPE.IN_DAY:
            return (
                <Tooltip title={"Gói tuyển dụng trong ngày"} placement="left">
                    <div className='in_day f-sm'>
                        {ntimeLeft}
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
    getListJobService: (id?: string) => any;
    getListEmployer: (body?: any, pageIndex?: number, pageSize?: number) => any;
    getListJobSuitableCandidate: (jid?: string, pageIndex?: number, pageSize?: number) => any;
    getListSchools: Function;
    handleDrawer: Function;
    handleModal: Function;
    getCanDetail?: Function;
};

interface IJobAnnouncementsListState {
    dataTable?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    employerID?: string;
    target?: string;
    jobNameID?: string;
    jobId?: string;
    showModal?: boolean;
    loading?: boolean;
    message?: string;
    listEmployerBranches?: Array<any>;
    valueType?: string;
    announcementTypeID?: number;
    createdDate?: number;
    adminID?: string;
    hidden?: boolean;
    listJobAnnouncements?: Array<any>;
    id?: string;
    loadingTable?: boolean;
    body?: IJobAnnouncementsFilter;
    un_checkbox?: boolean;
    list_check?: Array<any>;
    state_check_box?: Array<string>;
    openDrawer?: boolean;
    homePriority?: string;
    searchPriority?: string;
    homeExpired: boolean;
    searchExpired: boolean;
    jobAnnouncementDetail: IJobAnnouncementDetail;
    type_modal: string;
    eid?: string;
    opjd?: boolean;
    jid?: string;
};

class JobAnnouncementsList extends PureComponent<IJobAnnouncementsListProps, IJobAnnouncementsListState> {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: [],
            pageIndex: 0,
            pageSize: 10,
            employerID: null,
            jobNameID: null,
            jobId: null,
            showModal: false,
            loading: false,
            message: null,
            listEmployerBranches: [],
            valueType: null,
            announcementTypeID: null,
            createdDate: null,
            adminID: null,
            hidden: false,
            listJobAnnouncements: [],
            id: null,
            loadingTable: true,
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
            opjd: false,
            un_checkbox: false,
            list_check: [],
            homePriority: null,
            searchPriority: null,
            homeExpired: false,
            searchExpired: false,
            jobAnnouncementDetail: null,
            type_modal: null,
            eid: null,
            jid: null,
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
            width: 150,
            dataIndex: 'title',
            className: 'action',
            key: 'title',
        },

        {
            title: 'Tên công việc',
            dataIndex: 'jobName',
            key: 'jobName',
            width: 150,
        },
        {
            title: 'Ứng tuyển',
            dataIndex: 'apply',
            className: 'action',
            key: 'apply',
            render: (data) => this.ViewCount(data),
            width: 140,
        },
        {
            title: 'Tên NTD',
            dataIndex: 'employerName',
            className: 'action',
            key: 'employerName',
            width: 150,
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
            title: 'Email',
            dataIndex: 'employerBranchEmail',
            className: 'action',
            key: 'employerBranchEmail',
            width: 100,
        },
        {
            title: 'SDT',
            dataIndex: 'employerBranchPhone',
            className: 'action',
            key: 'employerBranchPhone',
            width: 100,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            className: 'action',
            key: 'address',
            width: 200,
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
            width: 200,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            dataIndex: 'operation',
            render: (item) => this.EditToolTip(item.id, item.employerID),
            width: 80,
        }
    ];

    viewname = ({ name, state }) => (
        <></>
    )

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
            label: 'Lọc',
            children: [
                {
                    value: TYPE.HIGHLIGHT,
                    label: 'Nổi bật',
                },
            ],
        },
    ];

    EditToolTip = (id?: string, eid?: string) => {
        return (
            <>
                <Tooltip placement="topRight" title={"Kích hoạt gói dịch vụ"}>
                    <Icon
                        className='test'
                        type="dollar"
                        style={{ padding: "5px 5px", color: "orange", margin: 2 }}
                        onClick={async () => {
                            await this.props.handleDrawer();
                            await setTimeout(() => {
                                this.props.getJobAnnouncementDetail(id);
                                this.props.getListJobService(eid);
                            }, 250);

                        }} />
                </Tooltip>
                <Tooltip placement="top" title={"Xem chi tiết(sửa)"}>
                    <Icon
                        className='test'
                        style={{ padding: "5px 5px", margin: 2 }}
                        type="eye"
                        theme="twoTone"
                        twoToneColor="green"
                        onClick={async () => {
                            await setTimeout(() => {
                                this.props.getJobAnnouncementDetail(id);
                                this.props.getListJobSuitableCandidate(id);
                                this.setState({ opjd: true, jid: id })
                            }, 250);

                        }}
                    />
                </Tooltip>
                <Popconfirm
                    placement="bottom"
                    title={"Xóa bài đăng"}
                    okText="Xóa"
                    okType="danger"
                    onConfirm={() => this.createRequest(DELETE)}
                >
                    <Icon
                        className='test'
                        style={{ padding: "5px 5px", margin: 2 }}
                        type="delete"
                        theme="twoTone"
                        twoToneColor="red"
                    />
                </Popconfirm>
            </>
        )
    }

    ViewCount = (data) =>
        (
            <>
                {viewCount(data.id, data.accepted, "#1687f2", TYPE.ACCEPTED, "user-add", "Chấp nhận")}
                {viewCount(data.id, data.rejected, "red", TYPE.REJECTED, "user-delete", "Từ Chối")}
                {viewCount(data.id, data.pending, "orange", TYPE.PENDING, "user", "Đang chờ")}
            </>
        )


    onToggleModal = () => {
        let { showModal } = this.state;
        this.setState({ showModal: !showModal });
    };

    static getDerivedStateFromProps(nextProps: IJobAnnouncementsListProps, prevState: IJobAnnouncementsListState) {
        if (
            nextProps.listJobAnnouncements &&
            nextProps.listJobAnnouncements !== prevState.listJobAnnouncements
        ) {
            let { pageIndex, pageSize } = prevState;
            let dataTable = [];

            nextProps.listJobAnnouncements.forEach((item: IJobAnnouncement, index: number) => {
                dataTable.push({
                    eid: item.employerID,
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    title: item.jobTitle + " " + (!item.expired ? "(Còn hạn)" : "(Hết hạn)"),
                    jobName: item.jobName ? item.jobName.name : "",
                    jobType: item.jobType,
                    employerBranchName: item.employerBranchName ? item.employerBranchName : "",
                    employerName: item.employerName ? item.employerName : "",
                    employerBranchPhone: item.employerBranchPhone ? item.employerBranchPhone : "",
                    employerBranchEmail: item.employerBranchEmail ? item.employerBranchEmail : "",
                    createdDate: timeConverter(item.createdDate, 1000),
                    expirationDate: timeConverter(item.expirationDate, 1000),
                    apply: {
                        accepted: item.acceptedApplied,
                        rejected: item.rejectedApplied,
                        pending: item.pendingApplied,
                        id: item.id
                    },
                    address: item.address ? item.address : "",
                    hidden: !item.hidden ? "Hiện" : "Ẩn",
                    priority:
                        <>
                            <ViewPriority priority={item.priority.homePriority} timeLeft={item.priority.homeTimeLeft} />
                            <ViewPriority priority={item.priority.searchPriority} timeLeft={item.priority.searchTimeLeft} />
                        </>,
                    operation: item
                });
            })

            return {
                listJobAnnouncements: nextProps.listJobAnnouncements,
                dataTable,
                loadingTable: false
            }
        }

        if (
            nextProps.jobAnnouncementDetail &&
            nextProps.jobAnnouncementDetail !== prevState.jobAnnouncementDetail
        ) {
            let { jobAnnouncementDetail } = nextProps;
            return {
                homePriority: jobAnnouncementDetail.priority.homePriority,
                searchPriority: jobAnnouncementDetail.priority.searchPriority,
                homeExpired: jobAnnouncementDetail.priority.homeExpired,
                searchExpired: jobAnnouncementDetail.priority.searchExpired,
                jobAnnouncementDetail,
            }
        }

        return null;
    };

    async componentDidMount() {
        await this.props.getListEmployer(undefined, 0, 10)
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
        this.searchJobAnnouncement();
    }

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.searchJobAnnouncement();
    };

    searchJobAnnouncement = async () => {
        let { body, pageIndex, pageSize } = this.state;
        await this.setState({ loadingTable: true });
        await setTimeout(() => {
            this.props.getListJobAnnouncements(body, pageIndex, pageSize);
        }, 250);
    };

    onChangeFilter = (event: any, param?: string) => {
        let { body } = this.state;
        let { listEmployerBranches, listEmployer } = this.props;
        let value: any = event;

        switch (param) {
            case TYPE.JOB_FILTER.jobNameIDs:
                value = [value];
                break;
            case TYPE.JOB_FILTER.jobLocationFilter:
                if (value) {
                    let data = listEmployerBranches.filter((item: IEmBranch, index: number) => { return item.id === event });
                    value = { distance: 1, lat: data[0].lat, lon: data[0].lon }
                }
                break;
            case TYPE.JOB_FILTER.employerID:
                if (value) {
                    let data = listEmployer.filter((item: IEmployer, index: number) => { return item.employerName === event });
                    if (data.length > 0) {
                        value = data[0].id
                    }
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
        if (param !== TYPE.JOB_FILTER.contactEmail || param !== TYPE.JOB_FILTER.contactEmail) {
            this.searchJobAnnouncement()
        }
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

    createRequest = async (type?: string) => {
        let {
            homePriority,
            searchPriority,
            id,
            eid
        } = this.state;
        let { modalState } = this.props;

        if (type && type === TYPE.DELETE) {
            await _requestToServer(
                DELETE,
                JOB_ANNOUNCEMENTS,
                [id],
                undefined,
                undefined,
                undefined,
                true,
                false
            ).then((res) => {
                if (res) {
                    this.searchJobAnnouncement();
                }
            })
        }

        await this.setState({ loading: true });
        switch (modalState.type_modal) {
            case TYPE.JOB_FILTER.homePriority:
                await _requestToServer(
                    POST,
                    EM_CONTROLLER + `/${eid}/jobs/${id}/priority/home`,
                    { homePriority },
                    undefined,
                    undefined,
                    undefined,
                    true,
                    false
                ).then((res: any) => {
                    if (res) {
                        this.requeryData()
                    }
                }).finally(
                    () => this.setState({
                        loading: false
                    })
                );
                break;

            case TYPE.JOB_FILTER.searchPriority:
                await _requestToServer(
                    POST,
                    EM_CONTROLLER + `/${eid}/jobs/${id}/priority/search`,
                    { searchPriority },
                    undefined,
                    undefined,
                    undefined,
                    true,
                    false
                ).then((res: any) => {
                    if (res) {
                        this.requeryData()
                    }
                }).finally(
                    () => this.setState({
                        loading: false
                    })
                );
                break;

            default:
                break;
        };
    };

    handleMdJobDetail = () => {
        let { opjd } = this.state;
        this.setState({ opjd: !opjd });
    };

    requeryData = async () => {
        let { id, eid } = this.state;
        await this.searchJobAnnouncement();
        await this.props.getListJobService(eid);
        await this.props.getJobAnnouncementDetail(id);
        await this.props.handleModal();
    }

    render() {
        let {
            dataTable,
            valueType,
            loadingTable,
            un_checkbox,
            list_check,
            homePriority,
            searchPriority,
            homeExpired,
            searchExpired,
            body,
            loading,
            opjd,
            jid
        } = this.state;

        let {
            jobAnnouncementDetail,
            totalItems,
            listJobNames,
            listEmployerBranches,
            listJobService,
            listEmployer,
            modalState,
            jobDetail,
            jobSuitableCandidates,
            CanDetail
        } = this.props;

        let homeExpiration = jobAnnouncementDetail.priority.homeExpiration;
        let searchExpiration = jobAnnouncementDetail.priority.searchExpiration;
        let un_active_home = homeExpiration !== -1 && !homeExpired;
        let un_active_search = searchExpiration !== -1 && !searchExpired;

        return (
            <>
                <Modal
                    visible={modalState.openModal}
                    title={"Workvn thông báo"}
                    destroyOnClose={true}
                    onOk={() => this.createRequest}
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
                <Modal
                    visible={opjd}
                    title={"Chi tiết công việc"}
                    destroyOnClose={true}
                    onOk={() => this.createRequest()}
                    width={'90vw'}
                    onCancel={() => {
                        this.setState({ opjd: false, loading: false });
                    }}
                    style={{ top: 20 }}
                    footer={[
                        <Button
                            key="cancel"
                            children="Hủy"
                            onClick={() => {
                                this.setState({
                                    opjd: false,
                                });
                            }}
                        />
                    ]}
                >
                    <Row>
                        <Col span={10}>
                            <JobDetail
                                jobDetail={{
                                    jobName: jobDetail.jobName.name,
                                    jobTitle: jobDetail.jobTitle,
                                    employerName: jobDetail.employerName,
                                    employerUrl: jobDetail.employerLogoUrl,
                                    expriratedDate: jobDetail.expirationDate,
                                    jobType: jobDetail.jobType,
                                    shifts: jobDetail.shifts,
                                    description: jobDetail.description,
                                }}
                                data={jobDetail.data}
                            />
                        </Col>
                        <Col span={4}>
                            <h6>SINH VIÊN TƯƠNG THÍCH</h6>
                            <JobSuitableCandidate
                                jobSuitableCandidates={jobSuitableCandidates.items}
                                pageIndex={jobSuitableCandidates.pageIndex}
                                pageSize={jobSuitableCandidates.pageSize}
                                totalItems={jobSuitableCandidates.totalItems}
                                onGetCanDetail={(id) => this.props.getCanDetail(id)}
                                onGetListJobSuitableCandidate={(pageIndex, pageSize) => this.props.getListJobSuitableCandidate(jid, pageIndex, pageSize)}
                            />
                        </Col>
                        <Col span={10}>
                            {
                                jobSuitableCandidates.items.length > 0 ? <CandidatetInfo data={CanDetail} /> : <Empty />
                            }

                        </Col>
                    </Row>
                </ Modal>
                <>
                    <DrawerConfig
                        title={"Kích hoạt gói dịch vụ tuyển dụng"}
                        width={800}
                    >
                        <h6>Các gói của bạn</h6>
                        <>
                            <label className='top f-b'>Gói tuyển dụng gấp: {listJobService.homeTopQuantiy}</label>
                            <label className='in_day f-b'>Gói tuyển dụng trong ngày: {listJobService.homeInDayQuantity}</label>
                            <label className='high_light f-b'>Gói tìm kiếm nổi bật:  {listJobService.searchHighLightQuantity}</label>
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
                                    <Radio value={TYPE.HIGHLIGHT}>Lọc nổi bật</Radio>
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
                    </DrawerConfig>
                    <div className="common-content">
                        <h5>
                            Quản lý bài đăng {`(${totalItems})`}
                            {/* <Button
                                onClick={() => this.searchJobAnnouncement()}
                                type="primary"
                                style={{
                                    float: "right",
                                    margin: "0px 10px",
                                }}
                                icon={loadingTable ? "loading" : "filter"}
                                children="Lọc"
                            /> */}
                            <Link to={routeLink.PENDING_JOBS + routePath.CREATE} >
                                <Button
                                    type="primary"
                                    style={{
                                        float: "right",
                                        margin: "0px 10px",
                                    }}
                                    icon={"plus"}
                                    children="Tạo mới"
                                />
                            </Link>
                        </h5>
                        <div className="table-operations">
                            <Row >
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                                    <IptLetterP value={"Email"} />
                                    <Search
                                        placeholder="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) =>
                                            this.onChangeFilter(
                                                event.target.value,
                                                TYPE.JOB_FILTER.contactEmail
                                            )
                                        }
                                        onPressEnter={(event: any) => this.searchJobAnnouncement()}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                                    <IptLetterP value={"Phone"} />
                                    <Search
                                        placeholder="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) =>
                                            this.onChangeFilter(
                                                event.target.value,
                                                TYPE.JOB_FILTER.contactPhone
                                            )
                                        }
                                        onPressEnter={(event: any) => this.searchJobAnnouncement()}
                                    />
                                </Col>
                                <Col xs={24} sm={12} md={16} lg={12} xl={12} xxl={6} >
                                    <IptLetterP value={"Tên nhà tuyển dụng"} />
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) => this.onChangeFilter(event, TYPE.JOB_FILTER.employerID)}
                                        onSearch={(event) => this.props.getListEmployer({ employerName: event }, 0, 10)}
                                    >
                                        <Option key={1} value={null}>Tất cả</Option>
                                        {
                                            listEmployer && listEmployer.map((item?: IEmController, i?: any) =>
                                                (<Option key={item.id} value={item.employerName}>{item.employerName + '(' + item.email + ')'} </Option>)
                                            )
                                        }
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                    <IptLetterP value={"Trạng thái hoạt động"} />
                                    <Select
                                        showSearch
                                        defaultValue="Tất cả"
                                        style={{ width: "100%" }}
                                        onChange={(event: any) => this.onChangeFilter(event, TYPE.JOB_FILTER.expired)}
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
                                        onChange={(event: any) => this.onChangeFilter(event, TYPE.JOB_FILTER.jobNameIDs)}
                                    >
                                        {
                                            listJobNames &&
                                            listJobNames.map(
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
                                        onChange={(event: any) => this.onChangeFilter(event, TYPE.JOB_FILTER.jobLocationFilter)}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        {
                                            listEmployerBranches &&
                                            listEmployerBranches.map(
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
                                        onChange={(event: any) => this.onChangeFilter(event, TYPE.JOB_FILTER.jobType)}
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
                                                }

                                                this.onChangeFilter(event[1], event[0]);
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
                                        onChange={(event: any) => this.onChangeFilter(event, TYPE.JOB_FILTER.expired)}
                                    >
                                        <Option value={null}>Tất cả</Option>
                                        <Option value={TYPE.FALSE}>Còn hạn</Option>
                                        <Option value={TYPE.TRUE}>Hết hạn</Option>
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
                                        value={valueType}
                                        onChange={(event: any) => this.onChangeFilter(event, TYPE.JOB_FILTER.hidden)}
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
                                            async (event: any) => {
                                                await this.handleCheckBox(event.target.checked);
                                                await this.setState({ un_checkbox: event.target.checked });
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
                                loading={loadingTable}
                                dataSource={dataTable}
                                locale={{ emptyText: 'Không có dữ liệu' }}
                                scroll={{ x: 1910 }}
                                bordered
                                pagination={{ total: totalItems, showSizeChanger: true }}
                                size="middle"
                                onChange={this.setPageIndex}
                                onRow={(record: any, rowIndex: any) => {
                                    return {
                                        onClick: (event: any) => {
                                            this.setState({ id: record.key, eid: record.eid })
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
    getListJobService: (id?: string) =>
        dispatch({ type: REDUX_SAGA.JOB_SERVICE.GET_JOB_SERVICE, id }),
    getCanDetail: (id?: string) =>
        dispatch({ type: REDUX_SAGA.STUDENTS.GET_STUDENT_DETAIl, id }),
    getListEmployer: (body?: string, pageIndex?: number, pageSize?: number) =>
        dispatch({ type: REDUX_SAGA.EMPLOYER.GET_EMPLOYER, body, pageIndex, pageSize }),
    getListJobSuitableCandidate: (jid?: string, pageIndex?: number, pageSize?: number) =>
        dispatch({ type: REDUX_SAGA.JOB_SUITABLE_CANDIDATE.GET_JOB_SUITABLE_CANDIDATE, jid, pageIndex, pageSize }),
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    listJobAnnouncements: state.JobAnnouncements.items,
    listJobNames: state.JobNames.items,
    listEmployerBranches: state.EmBranches.items,
    listJobService: state.JobServices,
    listEmployer: state.Employers.items,
    CanDetail: state.StudentDetail,
    jobAnnouncementDetail: state.JobAnnouncementDetail,
    modalState: state.MutilBox.modalState,
    drawerState: state.MutilBox.drawerState,
    totalItems: state.JobAnnouncements.totalItems,
    jobDetail: state.JobAnnouncementDetail,
    jobSuitableCandidates: state.JobSuitableCandidates
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobAnnouncementsList);