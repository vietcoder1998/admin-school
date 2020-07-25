import React from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA, REDUX } from '../../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, Avatar, Drawer, Slider, Tooltip, Popconfirm, Input } from 'antd';
import { timeConverter } from '../../../../../../utils/convertTime';
import { TYPE } from '../../../../../../const/type';
import { IptLetterP } from '../../../../layout/common/Common';
import { IAppState } from '../../../../../../redux/store/reducer';
import { IRegion } from '../../../../../../models/regions';
import { ICandidate, ICandidateFilter } from '../../../../../../models/candidates';
import findIdWithValue from '../../../../../../utils/findIdWithValue';
import { ISkill } from '../../../../../../models/candidates-detail';
import { ILanguage } from '../../../../../../models/languages';
import { IModalState } from '../../../../../../models/mutil-box';
import { IDrawerState } from 'antd/lib/drawer';
import { DELETE, PUT } from '../../../../../../const/method';
import { CANDIDATES } from '../../../../../../services/api/private.api';
import { _requestToServer } from '../../../../../../services/exec';
import CandidatetInfo from '../../../../layout/candidate-info/CandidatetInfo';
import CanInsertExels from './CanInsertExels';
let { Option } = Select;

let ImageRender = (props: any) => {
    if (props.src && props.src !== "") {
        return <Avatar shape="square" src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} icon="user" />
    } else {
        return <div style={{ width: 50, height: 50 }}>
            <Icon type="file-image" style={{ fontSize: 20 }} />
        </div>
    }
};

interface ICandidatesListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    handleModal?: Function;
    getListCandidates?: Function;
    getTypeManagement?: Function;
    getAnnoucements?: Function;
    getAnnoucementDetail?: Function;
    getCandidateDetail?: (id: string) => any;
};

interface ICandidatesListState {
    dataTable?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    typeCpn?: string;
    employerID?: string;
    showModal?: boolean;
    loading?: boolean;
    typeManagement?: Array<any>;
    announcementTypeID?: number;
    birthday?: number;
    adminID?: string;
    hidden?: boolean;
    listFindCandidates?: Array<any>;
    id?: string;
    loadingTable?: boolean;
    body?: ICandidateFilter;
    openDrawer: boolean;
    typeView?: string;
    openImport?: boolean;
};

class CandidatesList extends React.Component<ICandidatesListProps, ICandidatesListState> {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: [],
            pageIndex: 0,
            pageSize: 10,
            showModal: false,
            loading: false,
            announcementTypeID: null,
            birthday: null,
            adminID: null,
            hidden: false,
            listFindCandidates: [],
            id: null,
            loadingTable: true,
            body: {
                gender: null,
                birthYearStart: null,
                birthYearEnd: null,
                regionID: null,
                lookingForJob: null,
                profileVerified: null,
                completeProfile: null,
                jobNameIDs: [],
                skillIDs: [],
                languageIDs: [],
                unlocked: null,
            },
            typeCpn: null,
            openDrawer: false,
            openImport: false,
        };
    };

    EditToolAction = () => {
        let { id } = this.state;
        return <>
            <Tooltip title='Xem hồ sơ' >
                <Icon
                    className='test' style={{ padding: 5, margin: 2 }}
                    type={"search"}
                    onClick={() => {
                        this.setState({
                            openDrawer: true,
                            typeCpn: TYPE.DETAIL
                        });
                        setTimeout(() => {
                            this.props.getCandidateDetail(id);
                        }, 300);
                    }}
                />
            </Tooltip>
            <Tooltip title='Xác thực' >
                <Icon
                    className='test' style={{ padding: 5, margin: 2 }}
                    type={"safety-certificate"}
                    onClick={() => this.createRequest(TYPE.CERTIFICATE)}
                />
            </Tooltip>
            <Popconfirm
                placement="topRight"
                title={"Xóa"}
                onConfirm={() => this.createRequest(TYPE.DELETE)}
                okType={'danger'}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Icon className='test' style={{ padding: 5, margin: 2 }} type="delete" theme="twoTone" twoToneColor="red" />
            </Popconfirm>
        </>
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
            title: 'Ảnh',
            width: 30,
            dataIndex: 'avatarUrl',
            className: 'action',
            key: 'avatarUrl',
        },

        {
            title: 'Họ và tên',
            dataIndex: 'name',
            className: 'action',
            key: 'name',
            width: 200,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            className: 'action',
            key: 'gender',
            width: 100,
        },
        {
            title: 'Tìm việc',
            className: "action",
            dataIndex: 'lookingForJob',
            key: 'lookingForJob',
            width: 100,
        },
        {
            title: 'Xác thực',
            dataIndex: 'profileVerified',
            className: 'action',
            key: 'profileVerified',
            width: 100,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            className: 'action',
            key: 'email',
            width: 200,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            className: 'action',
            key: 'phone',
            width: 200,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 300,
        },
        {
            title: 'Tỉnh thành',
            dataIndex: 'region',
            className: 'action',
            key: 'region',
            width: 150,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthday',
            className: 'action',
            key: 'birthday',
            width: 100,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            className: 'action',
            key: 'createdDate',
            width: 100,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            render: () => this.EditToolAction(),
            width: 140,
        },
    ];


    onToggleModal = () => {
        let { showModal } = this.state;
        this.setState({ showModal: !showModal });
    };

    static getDerivedStateFromProps(nextProps?: ICandidatesListProps, prevState?: ICandidatesListState) {
        if (nextProps.listFindCandidates && nextProps.listFindCandidates !== prevState.listFindCandidates) {
            let { pageIndex, pageSize } = prevState;
            let dataTable = [];
            nextProps.listFindCandidates.forEach((item: ICandidate, index: number) => {
                dataTable.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    avatarUrl: <ImageRender src={item.avatarUrl} alt="Ảnh đại diện" />,
                    name: (item.lastName ? item.lastName : "") + " " + (item.firstName ? item.firstName : ""),
                    gender: item.gender === TYPE.MALE ? "nam" : "nữ",
                    email: item.email ? item.email : '',
                    phone: item.phone ? item.phone : '',
                    lookingForJob: item.lookingForJob ? "Có" : "Đã có việc",
                    address: item.address ? item.address : "",
                    region: item.region ? item.region.name : "",
                    birthday: item.birthday === -1 ? "Chưa cập nhật" : timeConverter(item.birthday, 1000, "DD/MM/YYYY"),
                    createdDate: item.createdDate === -1 ? "" : timeConverter(item.createdDate, 1000, "DD/MM/YYYY"),
                    profileVerified: <Tooltip title={(item.profileVerified ? "Đã" : "Chưa") + " xác thực"}><Icon type={"safety"} style={{ color: item.profileVerified ? "green" : "red" }} />  </Tooltip>,
                });
            })
            return {
                listFindCandidates: nextProps.listFindCandidates,
                dataTable,
                loadingTable: false,
            }
        }

        return { loadingTable: false }
    };

    async componentDidMount() {
        await this.searchCandidate();
    };

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.searchCandidate();
    };

    searchCandidate = async () => {
        let { body, pageIndex, pageSize } = this.state;
        await this.props.getListCandidates(body, pageIndex, pageSize);
    };

    onCloseDrawer = () => {
        this.setState({ openDrawer: false })
    };

    onChangeFilter = (event: any, param?: string) => {
        let { body } = this.state;
        let { listRegions } = this.props;
        let value: any = event;
        listRegions.forEach((item: IRegion) => { if (item.name === event) { value = item.id } });
        switch (event) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
                break;
            default:
                break;
        };

        body[param] = value;
        this.setState({ body });
    };

    onCancelAdvancedFind = () => {
        let { body } = this.state;
        body.skillIDs = [];
        body.birthYearStart = null;
        body.birthYearStart = null;
        body.languageIDs = [];
        body.jobNameIDs = [];
        this.setState({
            body,
            openDrawer: false
        })
    };

    createRequest = async (type?: string) => {
        let { id } = this.state;
        let { candidateDetail } = this.props;
        let method = null;
        let api = CANDIDATES;
        let body = [id];

        await this.setState({ loading: true });

        switch (type) {
            case TYPE.DELETE:
                method = DELETE;
                break;
            case TYPE.CERTIFICATE:
                method = PUT;
                api = api + `/${id}/profile/verified/${candidateDetail.profileVerified ? 'false' : 'true'}`;
                body = undefined;
                break;
            default:
                break;
        };

        await _requestToServer(
            method,
            api,
            body,
            undefined,
            undefined,
            undefined,
            true,
            false,
        ).then(
            (res: any) => {
                if (res) {
                    this.searchCandidate();
                }
            }
        ).finally(
            () => this.setState({ openDrawer: false, loading: false })
        )
    };


    advancedFilter = () => {
        let { body } = this.state;

        let { listSkills,
            listLanguages,
            listJobNames } = this.props;

        let list_skill_options = listSkills.map((item: ISkill, index: number) => (<Option key={index} value={item.name} children={item.name} />));
        let list_language_options = listLanguages.map((item: ILanguage, index: number) => (<Option key={index} value={item.name} children={item.name} />));
        let listJobNames_options = listJobNames.map((item: ILanguage, index: number) => (<Option key={index} value={item.name} children={item.name} />));

        return <>
            <IptLetterP
                value={"Năm sinh"}
            />
            <Slider
                min={1970}
                max={2010}
                range
                style={{
                    marginBottom: 50
                }}
                defaultValue={[1970, 2010]}
                marks={
                    {
                        2010: {
                            style: {
                            },
                            label: <strong>2010</strong>
                        },
                        1980: "80",
                        1990: "90",
                        2000: "2k",
                        1970: {
                            style: {
                            },
                            label: <strong>1970</strong>
                        }
                    }
                }
                onChange={(event: any) => {
                    body.birthYearStart = event[0];
                    body.birthYearEnd = event[1];
                    this.setState({ body });
                }}
            />
            <hr />
            <>
                <IptLetterP value={"Loại công việc"} />
                <Select
                    mode="multiple"
                    size="default"
                    placeholder="ex: Nhân viên văn phòng , Phục vụ ..."
                    value={findIdWithValue(listJobNames, body.jobNameIDs, "id", "name")}
                    onChange={
                        (event: any) => {
                            let listData = findIdWithValue(listJobNames, event, "name", "id")
                            body.jobNameIDs = listData;
                            this.setState({ body })
                        }
                    }
                    style={{ width: "100%" }}
                >
                    {listJobNames_options}
                </Select>
            </>
            <>
                <IptLetterP value={"Loại kĩ năng"} />
                <Select
                    mode="multiple"
                    size="default"
                    placeholder="ex: Giao tiếp, Tiếng Anh,..."
                    value={findIdWithValue(listSkills, body.skillIDs, "id", "name")}
                    onChange={
                        (event: any) => {
                            let listData = findIdWithValue(listSkills, event, "name", "id")
                            body.skillIDs = listData;
                            this.setState({ body })
                        }
                    }
                    style={{ width: "100%" }}
                >
                    {list_skill_options}
                </Select>
            </>

            <>
                <IptLetterP value={"Loại ngôn ngữ"} />
                <Select
                    mode="multiple"
                    size="default"
                    placeholder="ex: Tiếng Anh, Tiếng Trung,.."
                    value={findIdWithValue(listLanguages, body.languageIDs, "id", "name")}
                    onChange={
                        (event: any) => {
                            let listData = findIdWithValue(listLanguages, event, "name", "id")
                            body.languageIDs = listData;
                            this.setState({ body })
                        }
                    }
                    style={{ width: "100%" }}
                >
                    {list_language_options}
                </Select>
            </>
            <div style={{ padding: "40px 0px 20px ", width: "100%" }}>
                <Button
                    icon="close"
                    type="dashed"
                    style={{
                        float: "left"
                    }}
                    onClick={() => this.onCancelAdvancedFind()}
                >
                    Hủy
             </Button>
                <Button
                    icon="search"
                    type="primary"
                    style={{
                        float: "right"
                    }}
                    onClick={async () => {
                        await this.setState({ openDrawer: false });
                        await this.searchCandidate();                     
                    }}
                >
                    Lọc
            </Button>
            </div>
        </>
    }

    handleVisible = () => {
        let { openImport } = this.state;
        this.setState({ openImport: !openImport })
    }
    searchFilter = async () => {   // change index to 0 when start searching
        await this.setState({
          pageIndex: 0,
        });
        this.searchCandidate();
      };
    render() {
        let {
            dataTable,
            loadingTable,
            openDrawer,
            typeCpn,
            loading,
            openImport
        } = this.state;

        let {
            totalItems,
            listRegions,
            candidateDetail
        } = this.props;

        return (
            <>
                <Drawer
                    // title="Lọc nâng cao"
                    placement="right"
                    width={"60vw"}
                    closable={true}
                    onClose={() => this.onCancelAdvancedFind()}
                    visible={openDrawer}
                >
                    {
                        typeCpn === TYPE.DETAIL ?
                            <CandidatetInfo
                                data={candidateDetail}
                                onClickButton={() => this.createRequest(TYPE.CERTIFICATE)}
                                loading={loading}
                            /> :
                            this.advancedFilter()
                    }
                </Drawer>
                <CanInsertExels openImport={openImport} handleImport={() => this.handleVisible()} />
                <div className="common-content">
                    <h5>
                        Danh sách ứng viên
                        <Button
                            icon="upload"
                            onClick={() => this.handleVisible()}
                            type="primary"
                            style={{
                                float: "right",
                                marginRight: 5
                            }}
                        >
                            Import
                        </Button>
                        <Button
                            onClick={() => this.searchFilter()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 10px",
                            }}
                            icon={loadingTable ? "loading" : "filter"}
                            children={"Lọc ứng viên"}
                        />
                        <Button
                            onClick={() => this.setState({ openDrawer: true, typeCpn: TYPE.SEARCH })}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 10px",
                            }}
                            icon={'file-search'}
                            children={"Bộ lọc nâng cao"}
                        />
                    </h5>
                    <div className="table-operations">
                        <Row >
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tên tài khoản"} />
                                <Input
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event.target.value, TYPE.CANDIDATES_FILTER.username)}
                                    onPressEnter={(event: any) => this.searchFilter()}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tìm việc"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.CANDIDATES_FILTER.lookingForJob)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Có</Option>
                                    <Option value={TYPE.FALSE}>Đã có việc</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Giới tính"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.CANDIDATES_FILTER.gender)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.MALE}>Nam </Option>
                                    <Option value={TYPE.FEMALE}>Nữ</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tỉnh thành"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.CANDIDATES_FILTER.regionID)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    {
                                        listRegions && listRegions.length >= 1 ?
                                            listRegions.map((item: IRegion, index: number) =>
                                                <Option key={index} value={item.name}>{item.name}</Option>
                                            ) : null
                                    }
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Trạng thái hồ sơ"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.CANDIDATES_FILTER.completeProfile)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Hoàn thiện </Option>
                                    <Option value={TYPE.FALSE}>Chưa hoàn thiện</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tình trạng xác minh"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.CANDIDATES_FILTER.profileVerified)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Đã xác minh </Option>
                                    <Option value={TYPE.FALSE}>Chưa xác minh </Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Trạng thái mở khóa"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.CANDIDATES_FILTER.unlocked)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Đã mở khóa </Option>
                                    <Option value={TYPE.FALSE}>Chưa mở khóa</Option>
                                </Select>
                            </Col>
                        </Row>

                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loadingTable}
                            dataSource={dataTable}
                            locale={{ emptyText: 'Không có dữ liệu' }}
                            scroll={{ x: 2000 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(record: any, rowIndex: any) => {
                                return {
                                    onClick: (event: any) => {
                                    }, // click row
                                    onMouseEnter: (event) => {
                                        this.setState({ id: record.key });
                                    }, // mouse enter row
                                };
                            }}
                        />
                    </div>
                </div>
            </>
        )
    }
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListCandidates: (body: ICandidateFilter, pageIndex: number, pageSize: number) =>
        dispatch({ type: REDUX_SAGA.CANDIDATES.GET_CANDIDATES, body, pageIndex, pageSize }),
    getCandidateDetail: (id?: string) =>
        dispatch({ type: REDUX_SAGA.CANDIDATES.GET_CANDIDATE_DETAIL, id }),
    handleModal: (modalState: IModalState) =>
        dispatch({ type: REDUX.HANDLE_MODAL, modalState }),
    handleDrawer: (drawerState: IDrawerState) =>
        dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    listFindCandidates: state.Candidates.items,
    totalItems: state.Candidates.totalItems,
    listRegions: state.Regions.items,
    listSkills: state.Skills.items,
    listJobNames: state.JobNames.items,
    candidateDetail: state.CandidateDetail,
    listLanguages: state.Languages.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CandidatesList);