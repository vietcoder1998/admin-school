import React from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA, REDUX } from '../../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, Avatar, Drawer, Slider, Tooltip, Popconfirm } from 'antd';
import { timeConverter } from '../../../../../../utils/convertTime';
import { TYPE } from '../../../../../../const/type';
import { IptLetterP } from '../../../../layout/common/Common';
import { IAppState } from '../../../../../../redux/store/reducer';
import { IRegion } from '../../../../../../redux/models/regions';
import { ICandidate, ICandidateFilter } from '../../../../../../redux/models/candidates';
import findIdWithValue from '../../../../../../utils/findIdWithValue';
import { ISkill } from '../../../../../../redux/models/candidates-detail';
import { ILanguage } from '../../../../../../redux/models/languages';
import { IModalState } from '../../../../../../redux/models/mutil-box';
import { IDrawerState } from 'antd/lib/drawer';
import { DELETE, PUT } from '../../../../../../const/method';
import { CANDIDATES } from '../../../../../../services/api/private.api';
import { _requestToServer } from '../../../../../../services/exec';
import CandidatetInfo from '../../../../layout/candidate-info/CandidatetInfo';
let { Option } = Select;

let ImageRender = (props: any) => {
    if (props.src && props.src !== "") {
        return <Avatar shape="square" src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} icon="user" />
    } else {
        return <div style={{ width: 50, height: 50}}>
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
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
    type_cpn?: string;
    employerID?: string;
    show_modal?: boolean;
    loading?: boolean;
    type_management?: Array<any>;
    announcementTypeID?: number;
    birthday?: number;
    adminID?: string;
    hidden?: boolean;
    list_find_candidates?: Array<any>;
    id?: string;
    loading_table?: boolean;
    body?: ICandidateFilter;
    open_drawer: boolean;
    type_view?: string;
};

class CandidatesList extends React.Component<ICandidatesListProps, ICandidatesListState> {
    constructor(props) {
        super(props);
        this.state = {
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            show_modal: false,
            loading: false,
            announcementTypeID: null,
            birthday: null,
            adminID: null,
            hidden: false,
            list_find_candidates: [],
            id: null,
            loading_table: true,
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
            type_cpn: null,
            open_drawer: false
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
                            open_drawer: true,
                            type_cpn: TYPE.DETAIL
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
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            render: () => this.EditToolAction(),
            width: 140,
        },
    ];


    onToggleModal = () => {
        let { show_modal } = this.state;
        this.setState({ show_modal: !show_modal });
    };

    static getDerivedStateFromProps(nextProps?: ICandidatesListProps, prevState?: ICandidatesListState) {
        if (nextProps.list_find_candidates && nextProps.list_find_candidates !== prevState.list_find_candidates) {
            let { pageIndex, pageSize } = prevState;
            let data_table = [];
            nextProps.list_find_candidates.forEach((item: ICandidate, index: number) => {
                data_table.push({
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
                    birthday: item.birthday === -1 ? "" : timeConverter(item.birthday, 1000),
                    profileVerified: <Tooltip title={(item.profileVerified ? "Đã" : "Chưa") + " xác thực"}><Icon type={"safety"} style={{ color: item.profileVerified ? "green" : "red" }} />  </Tooltip>,
                });
            })
            return {
                list_find_candidates: nextProps.list_find_candidates,
                data_table,
                loading_table: false,
            }
        }

        return { loading_table: false }
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
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchCandidate();
    };

    searchCandidate = async () => {
        let { body, pageIndex, pageSize } = this.state;
        await this.props.getListCandidates(body, pageIndex, pageSize);
    };

    onCloseDrawer = () => {
        this.setState({ open_drawer: false })
    };

    onChangeType = (event: any, param?: string) => {
        let { body } = this.state;
        let { list_regions } = this.props;
        let value: any = event;
        list_regions.forEach((item: IRegion) => { if (item.name === event) { value = item.id } });
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
            open_drawer: false
        })
    };

    createRequest = async (type?: string) => {
        let { id } = this.state;
        let { candidate_detail } = this.props;
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
                api = api + `/${id}/profile/verified/${candidate_detail.profileVerified ? 'false' : 'true'}`;
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
            () => this.setState({ open_drawer: false, loading: false })
        )
    };


    advancedFilter = () => {
        let { body } = this.state;

        let { list_skills,
            list_languages,
            list_job_names } = this.props;

        let list_skill_options = list_skills.map((item: ISkill, index: number) => (<Option key={index} value={item.name} children={item.name} />));
        let list_language_options = list_languages.map((item: ILanguage, index: number) => (<Option key={index} value={item.name} children={item.name} />));
        let list_job_names_options = list_job_names.map((item: ILanguage, index: number) => (<Option key={index} value={item.name} children={item.name} />));
        
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
                    value={findIdWithValue(list_job_names, body.jobNameIDs, "id", "name")}
                    onChange={
                        (event: any) => {
                            let list_data = findIdWithValue(list_job_names, event, "name", "id")
                            body.jobNameIDs = list_data;
                            this.setState({ body })
                        }
                    }
                    style={{ width: "100%" }}
                >
                    {list_job_names_options}
                </Select>
            </>
            <>
                <IptLetterP value={"Loại kĩ năng"} />
                <Select
                    mode="multiple"
                    size="default"
                    placeholder="ex: Giao tiếp, Tiếng Anh,..."
                    value={findIdWithValue(list_skills, body.skillIDs, "id", "name")}
                    onChange={
                        (event: any) => {
                            let list_data = findIdWithValue(list_skills, event, "name", "id")
                            body.skillIDs = list_data;
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
                    value={findIdWithValue(list_languages, body.languageIDs, "id", "name")}
                    onChange={
                        (event: any) => {
                            let list_data = findIdWithValue(list_languages, event, "name", "id")
                            body.languageIDs = list_data;
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
                        await this.setState({ open_drawer: false });
                        await setTimeout(() => {
                            this.searchCandidate();
                        }, 250);
                    }}
                >
                    Tìm kiếm
            </Button>
            </div>
        </>
    }

    render() {
        let {
            data_table,
            loading_table,
            open_drawer,
            type_cpn,
            loading
        } = this.state;

        let {
            totalItems,
            list_regions,
            candidate_detail
        } = this.props;

        return (
            <>
                <Drawer
                    title="Tìm kiếm nâng cao"
                    placement="right"
                    width={"60vw"}
                    closable={true}
                    onClose={() => this.onCancelAdvancedFind()}
                    visible={open_drawer}
                >
                    {
                        type_cpn === TYPE.DETAIL ?
                            <CandidatetInfo
                                data={candidate_detail}
                                onClickButton={() => this.createRequest(TYPE.CERTIFICATE)}
                                loading={loading}
                            /> :
                            this.advancedFilter()
                    }
                </Drawer>
                <div className="common-content">
                    <h5>
                        Danh sách ứng viên
                        <Button
                            onClick={() => this.searchCandidate()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 10px",
                            }}
                            icon={loading_table ? "loading" : "search"}
                            children={"Tìm kiếm ứng viên"}
                        />
                        <Button
                            onClick={() => this.setState({ open_drawer: true , type_cpn: TYPE.SEARCH})}
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
                                <IptLetterP value={"Tìm việc"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeType(event, TYPE.CANDIDATES_FILTER.lookingForJob)}
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
                                    onChange={(event: any) => this.onChangeType(event, TYPE.CANDIDATES_FILTER.gender)}
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
                                    onChange={(event: any) => this.onChangeType(event, TYPE.CANDIDATES_FILTER.regionID)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    {
                                        list_regions && list_regions.length >= 1 ?
                                            list_regions.map((item: IRegion, index: number) =>
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
                                    onChange={(event: any) => this.onChangeType(event, TYPE.CANDIDATES_FILTER.completeProfile)}
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
                                    onChange={(event: any) => this.onChangeType(event, TYPE.CANDIDATES_FILTER.profileVerified)}
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
                                    onChange={(event: any) => this.onChangeType(event, TYPE.CANDIDATES_FILTER.unlocked)}
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
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 1690 }}
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
    list_find_candidates: state.Candidates.items,
    totalItems: state.Candidates.totalItems,
    list_regions: state.Regions.items,
    list_skills: state.Skills.items,
    list_job_names: state.JobNames.items,
    candidate_detail: state.CandidateDetail,
    list_languages: state.Languages.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CandidatesList);