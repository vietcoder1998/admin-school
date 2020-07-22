import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  Button,
  Table,
  Icon,
  Popconfirm,
  Col,
  Row,
  Input,
  Tooltip,
  Select,
  Modal,
  //  Avatar
} from "antd";
import "./SchoolsList.scss";
import { timeConverter } from "../../../../../../utils/convertTime";
import { IAppState } from "../../../../../../redux/store/reducer";
import { REDUX_SAGA, REDUX } from "../../../../../../const/actions";
import { _requestToServer } from "../../../../../../services/exec";
import { DELETE, PUT } from "../../../../../../const/method";
import { SCHOOLS, USER_CONTROLLER } from "../../../../../../services/api/private.api";
import { TYPE } from "../../../../../../const/type";
// import { IptLetterP } from '../../../../layout/common/Common';
import { ISchool, ISchoolsFilter } from "../../../../../../models/schools";
// import { Link } from 'react-router-dom';
import { routeLink, routePath } from "../../../../../../const/break-cumb";
import { IRegion } from "../../../../../../models/regions";
import DrawerConfig from "../../../../layout/config/DrawerConfig";
import { IDrawerState } from "../../../../../../models/mutil-box";
import SchoolInfo from "../../../../layout/school-info/SchoolInfo";
import { IptLetterP } from "../../../../layout/common/Common";
import { InputTitle } from "../../../../layout/input-tittle/InputTitle";

const { Option } = Select;

interface ISchoolsListProps extends StateProps, DispatchProps {
  match?: any;
  history?: any;
  location?: any;
  handleDrawer?: (drawerState?: IDrawerState) => any;
  getSchoolDetail?: (id?: string) => any;
  getListSchools: Function;
  getAnnoucementDetail: Function;
}

interface ISchoolsListState {
  dataTable?: Array<any>;
  search?: any;
  pageIndex?: number;
  pageSize?: number;
  showModal?: boolean;
  loading?: boolean;
  valueType?: string;
  id?: string;
  loadingTable?: boolean;
  body?: ISchoolsFilter;
  listSchools?: Array<ISchool>;
  educatedScaleState?: string;
  visible: boolean;
  newPassword?: string;
}

class SchoolsList extends PureComponent<ISchoolsListProps, ISchoolsListState> {
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
        name: null,
        shortName: null,
        educatedScale: null,
        regionID: null,
        schoolTypeID: null,
        email: null,
        employerID: null,
        connected: null,
        createdDate: null,
      },
      visible: false,
      listSchools: [],
      newPassword: null,
    };
  }

  EditToolAction = () => {
    let { id } = this.state;
    return (
      <>
              <Tooltip title="Đổi mật khẩu">
          <Icon
            className="test"
            style={{ padding: 5, margin: 2 }}
            type="key"
            onClick={()=> this.setState({visible: true})}
          />
        </Tooltip>
        <Tooltip title="Xem chi tiết trường ">
          <Icon
            className="test"
            style={{ padding: 5, margin: 2 }}
            type={"search"}
            onClick={() => {
              this.props.handleDrawer({ openDrawer: true });
              setTimeout(() => {
                this.props.getSchoolDetail(id);
              }, 500);
            }}
          />
        </Tooltip>
        <Popconfirm
          placement="topRight"
          title={"Xóa "}
          onConfirm={() => this.createRequest(TYPE.DELETE)}
          okType={"danger"}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Tooltip title="Xóa trường ">
            <Icon
              className="test"
              style={{ padding: 5, margin: 2 }}
              type="delete"
              theme="twoTone"
              twoToneColor="red"
            />
          </Tooltip>
        </Popconfirm>
      </>
    );
  };

  columns = [
    {
      title: "#",
      width: 50,
      dataIndex: "index",
      key: "index",
      className: "action",
      fixed: "left",
    },
    {
      title: "Tên rút gọn",
      dataIndex: "shortName",
      className: "action",
      key: "shortName",
      width: 100,
    },
    {
      title: "Tên nhà trường",
      dataIndex: "name",
      className: "action",
      key: "name",
      width: 250,
    },
    {
      title: "Email",
      dataIndex: "email",
      className: "action",
      key: "email",
      width: 250,
    },
    {
      title: "Số lượng sinh viên",
      dataIndex: "educatedScale",
      className: "action",
      key: "educatedScale",
      width: 150,
    },
    {
      title: "Tỉnh thành",
      dataIndex: "region",
      className: "action",
      key: "region",
      width: 100,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      className: "action",
      key: "createdDate",
      width: 150,
    },
    {
      title: "Thao tác",
      key: "operation",
      fixed: "right",
      className: "action",
      width: 100,
      render: () => this.EditToolAction(),
    },
  ];

  onToggleModal = () => {
    let { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  static getDerivedStateFromProps(
    nextProps?: ISchoolsListProps,
    prevState?: ISchoolsListState
  ) {
    if (
      nextProps.listSchools &&
      nextProps.listSchools !== prevState.listSchools
    ) {
      let { pageIndex, pageSize } = prevState;
      let dataTable = [];
      nextProps.listSchools.forEach((item: ISchool, index: number) => {
        dataTable.push({
          key: item.id,
          index:
            index +
            (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) +
            1,
          name: item.name ? item.name : "Chưa cập nhật",
          email: item.email ? item.email : "Chưa cập nhật",
          shortName: item.shortName ? item.shortName : "Chưa cập nhật",
          educatedScale:
            item.educatedScale === -1 ? "Chưa cập nhật" : item.educatedScale,
          region: item.region && item.region.name,
          createdDate:
            item.createdDate !== -1
              ? timeConverter(item.createdDate, 1000)
              : "",
        });
      });
      return {
        listSchools: nextProps.listSchools,
        dataTable,
        loadingTable: false,
      };
    }

    return { loadingTable: false };
  }

  async componentDidMount() {
    await this.searchSchools();
  }

  handleId = (event) => {
    if (event.key) {
      this.setState({ id: event.key });
    }
  };

  setPageIndex = async (event: any) => {
    await this.setState({
      pageIndex: event.current - 1,
      loadingTable: true,
      pageSize: event.pageSize,
    });
    await this.searchSchools();
  };

  searchSchools = async () => {
    let { pageIndex, pageSize, body } = this.state;
    await this.props.getListSchools(pageIndex, pageSize, body);
  };

  searchFilter = async () => {
    await this.setState({
      pageIndex: 0,
    });
    this.searchSchools();
  };

  createRequest = async (type?: string) => {
    let { id, educatedScaleState } = this.state;
    let method = null;
    let api = SCHOOLS;
    switch (type) {
      case TYPE.DELETE:
        method = DELETE;
        break;
      case TYPE.BAN:
        method = PUT;
        api =
          api +
          `/educatedScale/${educatedScaleState === "true" ? "false" : "true"}`;
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
      false
    ).then((res: any) => {
      if (res) {
        this.searchSchools();
      }
    });
  };

  onChangeFilter = (value?: any, type?: string) => {
    let { body } = this.state;
    let { listRegions } = this.props;
    listRegions.forEach((item: IRegion) => {
      if (item.name === value) {
        value = item.id;
      }
    });
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
  };

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

  render() {
    let { dataTable, loadingTable, loading, visible, newPassword } = this.state;
    let { totalItems, school_detail, listRegions } = this.props;
    return (
      <>
        <DrawerConfig width={"50vw"} title={"Thông tin Nhà trường"}>
          <SchoolInfo data={school_detail} />
          <Button
            icon={"left"}
            onClick={() => {
              this.props.handleDrawer({ openDrawer: false });
              this.props.history.push(routeLink.EM_CONTROLLER + routePath.LIST);
            }}
          >
            Thoát
          </Button>
        </DrawerConfig>
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
            Danh sách nhà trường
            <Button
              icon="filter"
              onClick={() => this.searchFilter()}
              type="primary"
              style={{
                float: "right",
              }}
            >
              Lọc
            </Button>
          </h5>
          <div className="table-operations">
            <Row>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Tên tài khoản"} />
                <Input
                  placeholder="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event.target.value,
                      TYPE.SCHOOLS.username
                    )
                  }
                  onPressEnter={(event: any) => this.searchFilter()}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Tên rút gọn"} />
                <Input
                  placeholder="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event.target.value,
                      TYPE.SCHOOLS.shortName
                    )
                  }
                  onPressEnter={(event: any) => this.searchFilter()}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Email"} />
                <Input
                  placeholder="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(event.target.value, TYPE.SCHOOLS.email)
                  }
                  onPressEnter={(event: any) => this.searchFilter()}
                />
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Tỉnh thành"} />
                <Select
                  showSearch
                  defaultValue="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(event, TYPE.SCHOOLS.regionID)
                  }
                >
                  <Option value={null}>Tất cả</Option>
                  {listRegions && listRegions.length >= 1
                    ? listRegions.map((item: IRegion, index: number) => (
                      <Option key={index} value={item.name}>
                        {item.name}
                      </Option>
                    ))
                    : null}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Yêu cầu kết nối"} />
                <Select
                  showSearch
                  defaultValue="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event: any) =>
                    this.onChangeFilter(event, TYPE.SCHOOLS.connected)
                  }
                >
                  <Option value={null}>Tất cả</Option>
                  <Option value={TYPE.TRUE}>Đã gửi </Option>
                  <Option value={TYPE.FALSE}>Chưa gửi</Option>
                </Select>
              </Col>
            </Row>
            <Table
              // @ts-ignore
              columns={this.columns}
              loading={loadingTable}
              dataSource={dataTable}
              scroll={{ x: 1100 }}
              bordered
              pagination={{
                total: totalItems,
                showSizeChanger: true,
                current: this.state.pageIndex + 1,
              }}
              size="middle"
              onChange={this.setPageIndex}
              onRow={(record: any, rowIndex: any) => {
                return {
                  onMouseEnter: () => {
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
  getListSchools: (
    pageIndex: number,
    pageSize: number,
    body?: ISchoolsFilter
  ) =>
    dispatch({
      type: REDUX_SAGA.SCHOOLS.GET_SCHOOLS,
      pageIndex,
      pageSize,
      body,
    }),
  getSchoolDetail: (id?: string) =>
    dispatch({ type: REDUX_SAGA.SCHOOLS.GET_SCHOOL_DETAIL, id }),
  handleDrawer: (drawerState?: IDrawerState) =>
    dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
  listSchools: state.Schools.items,
  listRegions: state.Regions.items,
  school_detail: state.SchoolsDetail,
  totalItems: state.Schools.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(SchoolsList);
