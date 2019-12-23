import React from 'react'
import { connect } from 'react-redux';
import { REDUX_SAGA, REDUX } from '../../../../../../const/actions';
import { Button, Table, Icon, Select, Row, Col, Avatar, Drawer, Slider, Tooltip } from 'antd';
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
import { routeLink, routePath } from '../../../../../../const/break-cumb';
let { Option } = Select;

let ImageRender = (props: any) => {
    if (props.src && props.src !== "") {
        return <Avatar shape="square" src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} icon="user" />
    } else {
        return <div style={{ width: "60px", height: "60px", padding: "20px 0px" }}>
            <Icon type="file-image" style={{ fontSize: 20 }} />
        </div>
    }
};

interface ICandidatesListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    handleModal: Function;
    getListCandidates: Function;
    getTypeManagement: Function;
    getAnnoucements: Function;
    getAnnoucementDetail: Function;
};

interface ICandidatesListState {
    data_table?: Array<any>;
    pageIndex?: number;
    pageSize?: number;
    state?: string;
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
            open_drawer: false
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
            title: 'Ảnh',
            width: 30,
            dataIndex: 'avatarUrl',
            className: 'action',
            key: 'avatarUrl',
        },
        {
            title: 'Mở khóa',
            dataIndex: 'unlocked',
            key: 'unlocked',
            className: "action",
            width: 90,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'lookingForJob',
            key: 'lookingForJob',
            width: 90,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            className: 'action',
            key: 'name',
            width: 100,
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            className: 'action',
            key: 'gender',
            width: 100,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: 320,
        },
        {
            title: 'Tỉnh thành',
            dataIndex: 'region',
            className: 'action',
            key: 'region',
            width: 100,
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
            dataIndex: 'operation',
            width: 80,
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
                let EditToolTip = (id?: string) => (
                    <>
                        <Tooltip placement="top" title={"Xem chi tiết"}>
                            <a
                                href={routeLink.CANDIDATES + routePath.DETAIL + `/${id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Icon
                                    className='test'
                                    style={{ padding: "5px 5px", color: "blue" }}
                                    type="search"
                                />
                            </a>
                        </Tooltip>
                    </>
                );

                const Lock = () => (
                    <>
                        <Tooltip placement="top" title={item.unlocked ? "Đã mở khóa" : "Chưa mở khóa"}>
                            <Icon
                                type={item.unlocked ? "unlock" : "lock"}
                                style={{ padding: "5px 5px", color: item.unlocked ? "green" : "red" }}
                            />
                        </Tooltip>
                    </>
                );

                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    avatarUrl: <ImageRender src={item.avatarUrl} alt="Ảnh đại diện" />,
                    name: (item.lastName ? item.lastName : "") + " " + (item.firstName ? item.firstName : ""),
                    gender: item.gender === TYPE.MALE ? "nam" : "nữ",
                    lookingForJob: item.lookingForJob ? "Đang tìm việc" : "Đã có việc",
                    address: item.address ? item.address : "",
                    region: item.region ? item.region.name : "",
                    birthday: item.birthday === -1 ? "" : timeConverter(item.birthday, 1000),
                    unlocked: Lock(),
                    operation: EditToolTip(item.id)
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
    }

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
        } = this.state;

        let {
            totalItems,
            list_regions,
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
                    {this.advancedFilter()}
                </Drawer>
                <div className="common-content">
                    <h5>
                        Tìm kiếm ứng viên
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
                            onClick={() => this.setState({ open_drawer: true })}
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
                                <IptLetterP value={"Trạng thái tìm việc"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeType(event, TYPE.CANDIDATES_FILTER.lookingForJob)}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.TRUE}>Đang tìm việc</Option>
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
                            scroll={{ x: 1000 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(record: any, rowIndex: any) => {
                                return {
                                    onClick: (event: any) => {
                                    }, // click row
                                    onMouseEnter: (event) => {
                                        localStorage.setItem('id_candidate', record.key)
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
    list_languages: state.Languages.items,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CandidatesList);