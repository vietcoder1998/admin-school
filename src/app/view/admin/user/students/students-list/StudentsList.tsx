import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  Button,
  Table,
  Icon,
  Popconfirm,
  Col,
  Select,
  Row,
  Tooltip,
  Avatar,
  Drawer,
  Slider,
  DatePicker,
  Modal,
} from "antd";
import "./StudentsList.scss";
import { timeConverter } from "../../../../../../utils/convertTime";
import { IAppState } from "../../../../../../redux/store/reducer";
import { REDUX_SAGA } from "../../../../../../const/actions";
import { _requestToServer } from "../../../../../../services/exec";
import { DELETE, PUT } from "../../../../../../const/method";
import { STUDENTS, USER_CONTROLLER } from "../../../../../../services/api/private.api";
import { TYPE } from "../../../../../../const/type";
import { IptLetterP } from "../../../../layout/common/Common";
import { IStudent, IStudentsFilter } from "../../../../../../models/students";
import { IRegion } from "../../../../../../models/regions";
import { ILanguage } from "../../../../../../models/languages";
import findIdWithValue from "../../../../../../utils/findIdWithValue";
import { ISkill } from "../../../../../../models/skills";
import StudentInfo from "../../../../layout/student-info/StudentInfo";
import StuInsertExels from "./StuInsertExels";
import moment from "moment";
import { InputTitle } from "../../../../layout/input-tittle/InputTitle";
import Search from "antd/lib/input/Search";
import { ISchool } from "../../../../../../models/schools";

let { Option } = Select;

interface IStudentsListProps extends StateProps, DispatchProps {
  match?: any;
  history?: any;
  location?: any;
  getListStudents: Function;
  getAnnoucementDetail: Function;
  getListSchools: Function;
  getStudentDetail: (id?: string) => any;
}

let ImageRender = (props: any) => {
  if (props.src && props.src !== "") {
    return (
      <Avatar
        shape={"square"}
        src={props.src}
        alt={props.alt}
        style={{ width: "60px", height: "60px" }}
      />
    );
  } else {
    return (
      <div style={{ width: "60px", height: "60px", padding: "20px 0px" }}>
        <Icon type="file-image" style={{ fontSize: 20 }} />
      </div>
    );
  }
};

interface IStudentsListState {
  dataTable?: Array<any>;
  search?: any;
  pageIndex?: number;
  pageSize?: number;
  showModal?: boolean;
  loading?: boolean;
  valueType?: string;
  id?: string;
  loadingTable?: boolean;
  body?: IStudentsFilter;
  listSchools?: Array<IStudent>;
  educatedScaleState?: string;
  openDrawer?: boolean;
  listStudents?: Array<IStudent>;
  typeCpn?: string;
  openImport?: boolean;
  visible?: boolean;
  newPassword?: string;
}

class StudentsList extends PureComponent<
  IStudentsListProps,
  IStudentsListState
  > {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: [],
      pageIndex: 0,
      pageSize: 10,
      showModal: false,
      loading: false,
      id: null,
      loadingTable: true,
      educatedScaleState: null,
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
      openDrawer: false,
      openImport: false,
      visible: false,
      newPassword: null,
    };
  }

  onChangePw = async () => {
    let { newPassword, id } = this.state;
    let api = USER_CONTROLLER + `/${id}/password`;
    await this.setState({ loading: true })
    await _requestToServer(
      PUT,
      api,
      { newPassword },
      undefined,
      undefined,
      undefined,
      true,
      false
    ).then((res) => {
      this.setState({ visible: false, loading: false })
    });
  }

  EditToolAction = () => {
    return (
      <>
        <Tooltip title="Đổi mật khẩu">
          <Icon
            className="test"
            style={{ padding: 5, margin: 2 }}
            type="key"
            onClick={() => this.setState({ visible: true })}
          />
        </Tooltip>
        <Tooltip title="Xác thực">
          <Icon
            className="test"
            style={{ padding: 5, margin: 2 }}
            type={"safety-certificate"}
            onClick={() => this.createRequest(TYPE.CERTIFICATE)}
          />
        </Tooltip>
        <Popconfirm
          placement="topRight"
          title={"Xóa"}
          onConfirm={() => this.createRequest(TYPE.DELETE)}
          okType={"danger"}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Icon
            className="test"
            style={{ padding: 5, margin: 2 }}
            type="delete"
            theme="twoTone"
            twoToneColor="red"
          />
        </Popconfirm>
      </>
    );
  };

  columns = [
    {
      title: "#",
      width: 20,
      dataIndex: "index",
      key: "index",
      className: "action",
      fixed: "left",
    },
    {
      title: "Ảnh",
      width: 60,
      dataIndex: "avatarUrl",
      className: "action",
      key: "avatarUrl",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: ({ item }) => this.renderName(item),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 100,
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      className: "action",
      key: "createdDate",
      width: 100,
    },
    {
      title: "Trường học",
      dataIndex: "school",
      key: "school",
      width: 200,
    },
    {
      title: "Ngành học",
      dataIndex: "major",
      className: "action",
      key: "major",
      width: 100,
    },
    {
      title: "Mã SV",
      dataIndex: "studentCode",
      key: "studentCode",
      width: 80,
    },
    {
      title: "Tỉnh ",
      dataIndex: "region",
      className: "action",
      key: "region",
      width: 90,
    },
    {
      title: "Thao tác",
      key: "operation",
      fixed: "right",
      className: "action",
      render: () => this.EditToolAction(),
      width: 80,
    },
  ];

  onToggleModal = () => {
    let { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  static getDerivedStateFromProps(
    nextProps?: IStudentsListProps,
    prevState?: IStudentsListState
  ) {
    if (
      nextProps.listStudents &&
      nextProps.listStudents !== prevState.listStudents
    ) {
      let { pageIndex, pageSize } = prevState;
      let dataTable = [];

      nextProps.listStudents.forEach((item: IStudent, index: number) => {
        dataTable.push({
          key: item.id,
          index:
            index +
            (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) +
            1,
          avatarUrl: <ImageRender src={item.avatarUrl} alt="Ảnh đại diện" />,
          name: { item },
          phone: item.phone ? item.phone : "Chưa cập nhật",
          email: item.email ? item.email : "Chưa cập nhật",
          school: item.school
            ? item.school.name + `(${item.school.shortName})`
            : "Chưa cập nhật",
          region: item.region ? item.region.name : "",
          major: item.major ? item.major.name : "",
          createdDate:
            item.createdDate === -1
              ? "Chưa cập nhật"
              : timeConverter(item.createdDate, 1000, "hh:mm:ss DD/MM/YYYY"),
          studentCode: item.studentCode
        });
      });
      return {
        listStudents: nextProps.listStudents,
        dataTable,
        loadingTable: false,
      };
    }

    return null;
  }

  async componentDidMount() {
    await this.searchStudents();
    await this.props.getListSchools(0, 10, { name: "" });
  }

  renderName = (item) => {
    return (
      <div>
        <span
          className="wapper-name-student"
          onClick={() => {
            this.setState({
              openDrawer: true,
              typeCpn: TYPE.DETAIL,
            });
            // setTimeout(() => {
            this.props.getStudentDetail(item.id);
            // }, 300);
          }}
        >
          <span className="nameStudent">
            {(item.lastName ? item.lastName : "") +
              " " +
              (item.firstName ? item.firstName : "")}
          </span>
          <Tooltip title={(item.profileVerified ? "Đã" : "Chưa") + " xác thực"}>
            <Icon
              type={"safety"}
              style={{
                color: item.profileVerified ? "green" : "red",
                position: "relative",
                top: 3.2,
                left: 3,
              }}
            />
          </Tooltip>
        </span>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            fontSize: "0.95em",
          }}
        >
          {item.gender === TYPE.MALE ? "Nam" : "Nữ"}
          ( {item.lookingForJob ? "Đang tìm việc" : "Đã có việc"})
        </div>
      </div>
    );
  };
  handleId = (event) => {
    if (event.key) {
      this.setState({ id: event.key });
    }
  };

  setPageIndex = async (event: any) => {
    await this.setState({
      pageIndex: event.current - 1,
      loadingTable: true,
      pageSize: 10,
    });
    await this.searchStudents();
  };

  searchStudents = async () => {
    let { pageIndex, pageSize, body } = this.state;
    await this.setState({ loadingTable: true });
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
      openDrawer: false,
    });
  };

  onGetListSchool = (name?: string) => {
    if (!name) {
      name = "";
    }
    this.props.getListSchools(0, 10, { shortName: name });
  };

  createRequest = async (type?: string) => {
    let { id } = this.state;
    let { studentDetail } = this.props;
    let method = null;
    let api = STUDENTS;
    let body = [id];
    await this.setState({ loading: true });
    switch (type) {
      case TYPE.DELETE:
        method = DELETE;
        break;
      case TYPE.CERTIFICATE:
        method = PUT;
        api =
          api +
          `/${id}/profile/verified/${
          studentDetail.profileVerified ? "false" : "true"
          }`;
        body = undefined;
        break;
      default:
        break;
    }

    await _requestToServer(
      method,
      api,
      body,
      undefined,
      undefined,
      undefined,
      true,
      false
    )
      .then((res: any) => {
        if (res) {
          this.searchStudents();
        }
      })
      .finally(() => this.setState({ openDrawer: false, loading: false }));
  };

  onChangeFilter = (value?: any, type?: string) => {
    let { body } = this.state;
    let { listRegions, listSchools } = this.props;

    switch (type) {
      case TYPE.STUDENT_FILTER.regionID:
        listRegions.forEach((item: IRegion) => {
          if (item.name === value) {
            value = item.id;
          }
        });
        break;
      case TYPE.STUDENT_FILTER.schoolID:
        listSchools.forEach((item: IRegion) => {
          if (item.name === value) {
            value = item.id;
          }
        });
        break;
      default:
        break;
    }

    switch (value) {
      case TYPE.TRUE:
        value = true;
        break;
      case TYPE.FALSE:
        value = false;
        break;
      default:
        break;
    }

    body[type] = value;
    this.setState({ body });

    if (
      type !== TYPE.STUDENT_FILTER.username ||
      type !== TYPE.STUDENT_FILTER.username
    ) {
      this.searchFilter();
    }
  };

  handleVisible = () => {
    let { openImport } = this.state;
    this.setState({ openImport: !openImport });
  };

  advancedFilter = () => {
    let { body } = this.state;
    let { listSkills, listLanguages } = this.props;

    let list_skill_options = listSkills.map((item: ISkill, index: number) => (
      <Select.Option key={index} value={item.name} children={item.name} />
    ));
    let list_language_options = listLanguages.map(
      (item: ILanguage, index: number) => (
        <Select.Option key={index} value={item.name} children={item.name} />
      )
    );

    return (
      <>
        <IptLetterP value={"Năm sinh"} />
        <Slider
          min={1970}
          max={2010}
          range
          style={{
            marginBottom: 50,
          }}
          defaultValue={[1970, 2010]}
          marks={{
            2010: {
              style: {},
              label: <strong>2010</strong>,
            },
            1980: "1980",
            1990: "1990",
            2000: "2000",
            1970: {
              style: {},
              label: <strong>1970</strong>,
            },
          }}
          onChange={(event: any) => {
            body.birthYearStart = event[0];
            body.birthYearEnd = event[1];
            this.setState({ body });
          }}
        />
        <hr />
        <IptLetterP value={"Loại kỹ năng"} />
        <Select
          mode="multiple"
          size="default"
          placeholder="ex: Giao tiếp, Tiếng Anh,..."
          // value={findIdWithValue(listSkills, body.skillIDs, "id", "name")}
          onChange={(event: any) => {
            // console.log(event);
            let listData = findIdWithValue(listSkills, event, "name", "id");
            body.skillIDs = listData;
            this.setState({ body });
          }}
          style={{ width: "100%" }}
        >
          {list_skill_options}
        </Select>
        <IptLetterP value={"Loại ngôn ngữ"} />
        <Select
          mode="multiple"
          size="default"
          placeholder="ex: Tiếng Anh, Tiếng Trung,.."
          //   value={findIdWithValue(listLanguages, body.languageIDs, "id", "name")}
          onChange={(event: any) => {
            let listData = findIdWithValue(listLanguages, event, "name", "id");
            body.languageIDs = listData;
            this.setState({ body });
          }}
          style={{ width: "100%" }}
        >
          {list_language_options}
        </Select>
        <div style={{ padding: "40px 0px 20px ", width: "100%" }}>
          <Button
            icon="close"
            type="dashed"
            style={{
              float: "left",
            }}
            onClick={() => this.onCancelAdvancedFind()}
          >
            Hủy
          </Button>
          <Button
            icon="search"
            type="primary"
            style={{
              float: "right",
            }}
            onClick={async () => {
              await this.setState({ openDrawer: false, typeCpn: TYPE.DETAIL });
              await setTimeout(() => {
                this.searchFilter();
              }, 250);
            }}
          >
            Lọc
          </Button>
        </div>
      </>
    );
  };

  searchFilter = async () => {
    // change index to 0 when start searching
    await this.setState({
      pageIndex: 0,
    });
    this.searchStudents();
  };

  render() {
    let {
      dataTable,
      loadingTable,
      openDrawer,
      typeCpn,
      loading,
      openImport,
      body,
      visible,
      newPassword
    } = this.state;
    let { totalItems, listRegions, listSchools, studentDetail } = this.props;

    return (
      <>
        <Drawer
          title="Lọc nâng cao"
          placement="right"
          width={"60vw"}
          closable={true}
          onClose={() => this.onCancelAdvancedFind()}
          visible={openDrawer}
        >
          {typeCpn === TYPE.DETAIL ? (
            <StudentInfo
              data={studentDetail}
              onClickButton={() => this.createRequest(TYPE.CERTIFICATE)}
              loading={loading}
            />
          ) : (
              this.advancedFilter()
            )}
        </Drawer>
        <StuInsertExels
          openImport={openImport}
          handleImport={() => this.handleVisible()}
          listSchools={listSchools}
          getListSchool={this.onGetListSchool}
        />
        <Modal
          title="Đổi mật khẩu"
          visible={this.state.visible}
          onOk={this.onChangePw}
          onCancel={() => this.setState({ visible: !visible })}
          okText="Thay đổi"
          cancelText="Hủy"
          confirmLoading={loading}
        >
          <InputTitle
            title={"Mật khẩu mới"}
            placeholder={"Nhập mật khẩu"}
            type={TYPE.INPUT}
            value={newPassword}
            onChange={(event) => this.setState({ newPassword: event })}
          />
        </Modal>
        <div className="common-content">
          <h5>
            Danh sách sinh viên ({totalItems})
            <Button
              icon="upload"
              onClick={() => this.handleVisible()}
              type="primary"
              style={{
                float: "right",
                marginRight: 5,
              }}
            >
              Import
            </Button>
            {/* <Button
              onClick={() => this.searchFilter()}
              type="primary"
              style={{
                float: "right",
                margin: "0px 10px",
              }}
              icon={loadingTable ? "loading" : "filter"}
              children={"Lọc"}
            /> */}
            <Button
              onClick={() =>
                this.setState({ openDrawer: true, typeCpn: TYPE.SEARCH })
              }
              type="primary"
              style={{
                float: "right",
                margin: "0px 10px",
              }}
              icon={"file-search"}
              children={"Bộ lọc nâng cao"}
            />
          </h5>
          <div className="table-operations">
            <Row style={{ marginBottom: 10 }}>
              <Col xs={24} sm={12} md={16} lg={9} xl={9} xxl={9} >
                <IptLetterP value={"Tên trường"} />
                <Select
                  showSearch
                  defaultValue="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) => this.onChangeFilter(event, TYPE.STUDENT_FILTER.schoolID)}
                  onSearch={(event) => this.props.getListSchools({ name: event }, 0, 10)}
                >
                  <Option key={1} value={null}>Tất cả</Option>
                  {
                    listSchools && listSchools.map((item?: ISchool, i?: any) =>
                      (<Option key={item.id} value={item.name}>{item.name + '(' + item.email + ')'} </Option>)
                    )
                  }
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Mã sinh viên"} />
                <Search
                  placeholder="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event.target.value,
                      TYPE.STUDENT_FILTER.studentCode
                    )
                  }
                  onPressEnter={(event: any) => this.searchFilter()}
                />

              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Email"} />
                <Search
                  placeholder="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event.target.value,
                      TYPE.STUDENT_FILTER.username
                    )
                  }
                  onPressEnter={(event: any) => this.searchFilter()}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={3} xl={3} xxl={3}>
                <IptLetterP value={"Xác thực"} />
                <Select
                  showSearch
                  defaultValue="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event,
                      TYPE.STUDENT_FILTER.profileVerified
                    )
                  }
                >
                  <Select.Option key="1" value={null}>
                    Tất cả
                  </Select.Option>
                  <Select.Option key="2" value={TYPE.TRUE}>
                    Có
                  </Select.Option>
                  <Select.Option key="3" value={TYPE.FALSE}>
                    Không
                  </Select.Option>
                </Select>
              </Col>

              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Ngày tạo tài khoản"} />
                <DatePicker
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  placeholder={"ex: " + moment().format("DD/MM/YYYY")}
                  defaultPickerValue={null}
                  value={body.createdDate ? moment(body.createdDate) : null}
                  onChange={(event?: any) => {
                    // console.log(event)
                    event
                      ? (body.createdDate = event.unix() * 1000)
                      : (body.createdDate = null);
                    this.setState({ body });
                    this.forceUpdate();
                    this.searchStudents();
                  }}
                />
              </Col>

              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Tỉnh thành"} />
                <Select
                  showSearch
                  defaultValue="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(event, TYPE.STUDENT_FILTER.regionID)
                  }
                >
                  <Select.Option value={null}>Tất cả</Select.Option>
                  {listRegions && listRegions.length >= 1
                    ? listRegions.map((item: IRegion, index: number) => (
                      <Select.Option key={index} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))
                    : null}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={3} xl={3} xxl={3}>
                <IptLetterP value={"Tìm việc"} />
                <Select
                  showSearch
                  defaultValue="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event,
                      TYPE.STUDENT_FILTER.lookingForJob
                    )
                  }
                >
                  <Select.Option value={null}>Tất cả</Select.Option>
                  <Select.Option value={TYPE.TRUE}>Có</Select.Option>
                  <Select.Option value={TYPE.FALSE}>Đã có việc</Select.Option>
                </Select>
              </Col>
            </Row>
            <Table
              // @ts-ignore
              columns={this.columns}
              loading={loadingTable}
              dataSource={dataTable}
              locale={{ emptyText: 'Không có dữ liệu' }}
              scroll={{ x: 1130 }}
              bordered
              pagination={{ total: totalItems, pageSize: 10 }}
              size="middle"
              onChange={this.setPageIndex}
              onRow={(record: any, rowIndex: any) => {
                return {
                  onClick: (event: any) => { }, // click row
                  onMouseEnter: (event) => {
                    this.setState({ id: record.key });
                  }, // mouse enter row
                };
              }}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
  getListStudents: (
    pageIndex: number,
    pageSize: number,
    body?: IStudentsFilter
  ) =>
    dispatch({
      type: REDUX_SAGA.STUDENTS.GET_STUDENTS,
      pageIndex,
      pageSize,
      body,
    }),
  getListSchools: (
    pageIndex: number,
    pageSize: number,
    body?: IStudentsFilter
  ) =>
    dispatch({
      type: REDUX_SAGA.SCHOOLS.GET_SCHOOLS,
      pageIndex,
      pageSize,
      body,
    }),
  getStudentDetail: (id?: string) =>
    dispatch({ type: REDUX_SAGA.STUDENTS.GET_STUDENT_DETAIl, id }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
  listSchools: state.Schools.items,
  listRegions: state.Regions.items,
  listSkills: state.Skills.items,
  listLanguages: state.Languages.items,
  listJobNames: state.JobNames.items,
  listStudents: state.Students.items,
  studentDetail: state.StudentDetail,
  totalItems: state.Students.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(StudentsList);
