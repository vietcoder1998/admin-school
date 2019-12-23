import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Button, Table, Icon, Popconfirm, Col, Select, Row, Tooltip, Avatar, Drawer, Slider } from 'antd';
import './StudentsList';
import { timeConverter } from '../../../../../../utils/convertTime';
import { IAppState } from '../../../../../../redux/store/reducer';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { _requestToServer } from '../../../../../../services/exec';
import { DELETE, PUT } from '../../../../../../const/method';
import { USER_CONTROLLER } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../const/type';
import { IptLetterP } from '../../../../layout/common/Common';
import { IStudent, IStudentsFilter } from '../../../../../../redux/models/students';
import { Link } from 'react-router-dom';
import { routeLink, routePath } from '../../../../../../const/break-cumb';
import { IRegion } from '../../../../../../redux/models/regions';
import { ILanguage } from '../../../../../../redux/models/languages';
import findIdWithValue from '../../../../../../utils/findIdWithValue';
import { ISkill } from '../../../../../../redux/models/skills';

interface IStudentsListProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    location?: any;
    getListStudents: Function;
    getAnnoucementDetail: Function;
};

let ImageRender = (props: any) => {
    if (props.src && props.src !== "") {
        return <Avatar shape={"square"} src={props.src} alt={props.alt} style={{ width: "60px", height: "60px" }} />
    } else {
        return <div style={{ width: "60px", height: "60px", padding: "20px 0px" }}>
            <Icon type="file-image" style={{fontSize: 20}}/>
        </div>
    }
};

interface IStudentsListState {
    data_table?: Array<any>;
    search?: any;
    pageIndex?: number;
    pageSize?: number;
    show_modal?: boolean;
    loading?: boolean;
    value_type?: string;
    id?: string;
    loading_table?: boolean;
    body?: IStudentsFilter;
    list_schools?: Array<IStudent>;
    educatedScale_state?: string;
    open_drawer?: boolean;
    list_students?: Array<IStudent>;
};

class StudentsList extends PureComponent<IStudentsListProps, IStudentsListState> {
    constructor(props) {
        super(props);
        this.state = {
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            show_modal: false,
            loading: false,
            id: null,
            loading_table: true,
            educatedScale_state: null,
            body: {
                email: null,
                phone: null,
                gender: null,
                birthYearStart: null,
                birthYearEnd: null,
                regionID: null,
                lookingForJob: null,
                profileVerified: null,
                majorIDs: null,
                schoolYearStart: null,
                schoolYearEnd: null,
                skillIDs: [],
                languageIDs: [],
                schoolID: null,
                employerID: null,
                unlocked: null,
                ids: [],
                createdDate: null,
            },
            open_drawer: false,

        };
    }

    editToolAction = () => {
        let { id } = this.state;
        return <>
            <Tooltip title='Xem hồ sơ nhà tuyển dụng' >
                <Icon
                    className='test' style={{ padding: 5, margin: 2 }}
                    type={"search"}
                />
            </Tooltip>
            <Tooltip title='Xem danh sách chi nhánh' >
                <Link to={routeLink.EM_BRANCHES + routePath.LIST + `/${id}`} target='_blank' >
                    <Icon
                        className='test' style={{ padding: 5, margin: 2 }}
                        type={"container"}
                    />
                </Link>
            </Tooltip>
            <Tooltip title='Chứng thực nhà tuyển dụng' >
                <Icon
                    className='test' style={{ padding: 5, margin: 2 }}
                    type={"safety-certificate"}
                />
            </Tooltip>
            <Popconfirm
                placement="topRight"
                title={"Xóa khỏi danh sách"}
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
            key: 'gender',
            className: "action",
            width: 100,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 150,
        },
        {
            title: 'Trường học',
            dataIndex: 'school',
            key: 'school',
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
            title: 'Xác thực',
            dataIndex: 'profileVerified',
            className: 'action',
            key: 'profileVerified',
            width: 100,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'lookingForJob',
            key: 'lookingForJob',
            width: 150,
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
            width: 100,
        },
        {
            title: 'Ngành học',
            dataIndex: 'major',
            className: 'action',
            key: 'major',
            width: 150,
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
            dataIndex: 'operation',
            width: 100,
        },
    ];

    onToggleModal = () => {
        let { show_modal } = this.state;
        this.setState({ show_modal: !show_modal });
    };

    static getDerivedStateFromProps(nextProps?: IStudentsListProps, prevState?: IStudentsListState) {
        if (nextProps.list_students && nextProps.list_students !== prevState.list_students) {
            let { pageIndex, pageSize } = prevState;
            let data_table = [];
            nextProps.list_students.forEach((item: IStudent, index: number) => {

                let EditToolTip = (id?: string) => (
                    <>
                        <Tooltip placement="top" title={"Xem chi tiết"}>
                            <a
                                href={routeLink.STUDENTS + routePath.DETAIL + `/${id}`}
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

                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    avatarUrl: <ImageRender src={item.avatarUrl} alt="Ảnh đại diện" />,
                    name: (item.lastName ? item.lastName : "") + " " + (item.firstName ? item.firstName : ""),
                    gender: item.gender === TYPE.MALE ? 'Nam' : 'Nữ',
                    phone: item.phone ? item.phone : '',
                    profileVerified: <Icon type={"safety"} style={{ color: item.profileVerified ? "green" : "red" }} />,
                    lookingForJob: item.lookingForJob ? "Đang tìm việc" : "Đã có việc",
                    email: item.email ? item.email : '',
                    school: item.school ? item.school : '',
                    address: item.address ? item.address : "",
                    region: item.region ? item.region.name : "",
                    major: item.major ? item.major.name : "",
                    birthday: item.birthday === -1 ? "" : timeConverter(item.birthday, 1000),
                    createdDate: item.createdDate === -1 ? "" : timeConverter(item.createdDate, 1000),
                    operation: EditToolTip(item.id)
                });
            })
            return {
                list_students: nextProps.list_students,
                data_table,
                loading_table: false,
            }
        }

        return { loading_table: false }
    };

    async componentDidMount() {
        await this.searchStudents();
    };

    handleId = (event) => {
        if (event.key) {
            this.setState({ id: event.key })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        await this.searchStudents();
    };

    searchStudents = async () => {
        let { pageIndex, pageSize, body } = this.state;
        await this.props.getListStudents(pageIndex, pageSize, body);
    };

    onCancelAdvancedFind = () => {
        let { body } = this.state;
        body.skillIDs = [];
        body.birthYearStart = null;
        body.birthYearStart = null;
        body.languageIDs = [];
        this.setState({
            body,
            open_drawer: false
        })
    }

    createRequest = async (type?: string) => {
        let { id, educatedScale_state } = this.state;
        let method = null;
        let api = USER_CONTROLLER;
        switch (type) {
            case TYPE.DELETE:
                method = DELETE;
                break;
            case TYPE.BAN:
                method = PUT;
                api = api + `/educatedScale/${educatedScale_state === 'true' ? 'false' : 'true'}`
                break;
            default:
                break;
        }
        await _requestToServer(
            method,
            api,
            [id],
            undefined,
            undefined,
            undefined,
            true,
            false,
        ).then(
            (res: any) => {
                if (res) { this.searchStudents() }
            }
        )
    }

    onChangeFilter = (value?: any, type?: string) => {
        let { body } = this.state;
        let { list_regions } = this.props;
        list_regions.forEach((item: IRegion) => { if (item.name === value) { value = item.id } });

        switch (value) {
            case TYPE.TRUE:
                value = true;
                break;
            case TYPE.FALSE:
                value = false;
                break;
            default:
                break;
        };
     
        body[type] = value;
        this.setState({ body });
    }

    advancedFilter = () => {
        let { body } = this.state;

        let {
            list_skills,
            list_languages,
        } = this.props;

        let list_skill_options = list_skills.map((item: ISkill, index: number) => (<Select.Option key={index} value={item.name} children={item.name} />));
        let list_language_options = list_languages.map((item: ILanguage, index: number) => (<Select.Option key={index} value={item.name} children={item.name} />));

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
                            // this.searchStudents();
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
            list_regions
        } = this.props
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
                        Tìm kiếm học sinh
                        <Button
                            onClick={() => this.searchStudents()}
                            type="primary"
                            style={{
                                float: "right",
                                margin: "0px 10px",
                            }}
                            icon={loading_table ? "loading" : "search"}
                            children={"Tìm kiếm học sinh"}
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
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.STUDENT_FILTER.lookingForJob)}
                                >
                                    <Select.Option value={null}>Tất cả</Select.Option>
                                    <Select.Option value={TYPE.TRUE}>Đang tìm việc</Select.Option>
                                    <Select.Option value={TYPE.FALSE}>Đã có việc</Select.Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Giới tính"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.STUDENT_FILTER.gender)}
                                >
                                    <Select.Option value={null}>Tất cả</Select.Option>
                                    <Select.Option value={TYPE.MALE}>Nam </Select.Option>
                                    <Select.Option value={TYPE.FEMALE}>Nữ</Select.Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tỉnh thành"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.STUDENT_FILTER.regionID)}
                                >
                                    <Select.Option value={null}>Tất cả</Select.Option>
                                    {
                                        list_regions && list_regions.length >= 1 ?
                                            list_regions.map((item: IRegion, index: number) =>
                                                <Select.Option key={index} value={item.name}>{item.name}</Select.Option>
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
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.STUDENT_FILTER.completeProfile)}
                                >
                                    <Select.Option value={null}>Tất cả</Select.Option>
                                    <Select.Option value={TYPE.TRUE}>Hoàn thiện </Select.Option>
                                    <Select.Option value={TYPE.FALSE}>Chưa hoàn thiện</Select.Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Tình trạng xác minh"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.STUDENT_FILTER.profileVerified)}
                                >
                                    <Select.Option value={null}>Tất cả</Select.Option>
                                    <Select.Option value={TYPE.TRUE}>Đã xác minh </Select.Option>
                                    <Select.Option value={TYPE.FALSE}>Chưa xác minh </Select.Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} >
                                <IptLetterP value={"Trạng thái mở khóa"} />
                                <Select
                                    showSearch
                                    defaultValue="Tất cả"
                                    style={{ width: "100%" }}
                                    onChange={(event: any) => this.onChangeFilter(event, TYPE.STUDENT_FILTER.unlocked)}
                                >
                                    <Select.Option value={null}>Tất cả</Select.Option>
                                    <Select.Option value={TYPE.TRUE}>Đã mở khóa </Select.Option>
                                    <Select.Option value={TYPE.FALSE}>Chưa mở khóa</Select.Option>
                                </Select>
                            </Col>
                        </Row>

                        <Table
                            // @ts-ignore
                            columns={this.columns}
                            loading={loading_table}
                            dataSource={data_table}
                            scroll={{ x: 1900 }}
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
            </ >
        )
    }
};

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListStudents: (pageIndex: number, pageSize: number, body?: IStudentsFilter) =>
        dispatch({ type: REDUX_SAGA.STUDENTS.GET_STUDENTS, pageIndex, pageSize, body }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    list_schools: state.Students.items,
    list_regions: state.Regions.items,
    list_skills: state.Skills.items,
    list_languages: state.Languages.items,
    list_job_names: state.JobNames.items,
    list_students: state.Students.items,
    totalItems: state.Students.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);