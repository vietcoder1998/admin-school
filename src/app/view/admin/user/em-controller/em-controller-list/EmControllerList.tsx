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
  Input,
  Tooltip,
  Avatar,
  Modal,
} from "antd";
import "./EmControllerList.scss";
import { timeConverter } from "../../../../../../utils/convertTime";
import { IAppState } from "../../../../../../redux/store/reducer";
import { REDUX_SAGA, REDUX } from "../../../../../../const/actions";
import { _requestToServer } from "../../../../../../services/exec";
import { DELETE, PUT } from "../../../../../../const/method";
import { EM_CONTROLLER, USER_CONTROLLER } from "../../../../../../services/api/private.api";
import { TYPE } from "../../../../../../const/type";
import { IptLetterP } from "../../../../layout/common/Common";
import {
  IEmController,
  IEmControllerFilter,
} from "../../../../../../models/em-controller";
import { Link } from "react-router-dom";
import { routeLink, routePath } from "../../../../../../const/break-cumb";
import { IRegion } from "../../../../../../models/regions";
import { IDrawerState } from "../../../../../../models/mutil-box";
import DrawerConfig from "./../../../../layout/config/DrawerConfig";
import EmInfo from "../../../../layout/em-info/EmInfo";
import IImportCan from "../../../../../../models/import-can";
import EmInsertExels from "./EmInsertExels";
import { InputTitle } from "../../../../layout/input-tittle/InputTitle";

interface IEmControllerListProps extends StateProps, DispatchProps {
  match?: any;
  history?: any;
  location?: any;
  getListEmControllers?: (
    pageIndex?: number,
    pageSize?: number,
    body?: IEmControllerFilter
  ) => any;
  getEmployerDetail?: (id?: string) => any;
  handleDrawer?: (drawerState?: IDrawerState) => any;
  importFile?: (params?: IImportCan) => any;
}

interface IEmControllerListState {
  dataTable?: Array<any>;
  search?: any;
  pageIndex?: number;
  pageSize?: number;
  showModal?: boolean;
  loading?: boolean;
  valueType?: string;
  id?: string;
  loadingTable?: boolean;
  body?: IEmControllerFilter;
  list_user_controller?: Array<IEmController>;
  profileVerified_state?: string;
  openImport?: boolean;
  visible?: boolean;
  newPassword?: string;
}

class EmControllerList extends PureComponent<
  IEmControllerListProps,
  IEmControllerListState
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
      profileVerified_state: null,
      body: {
        employerName: null,
        taxCode: null,
        regionID: null,
        profileVerified: null,
        ids: [],
      },
      list_user_controller: [],
      openImport: false,
      visible: false,
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
            onClick={() => this.setState({ visible: true })}
          />
        </Tooltip>
        <Tooltip title="Xem hồ sơ ">
          <Icon
            className="test"
            style={{ padding: 5, margin: 2 }}
            type={"search"}
            onClick={() => {
              this.props.handleDrawer({ openDrawer: true });
              setTimeout(() => {
                this.props.getEmployerDetail(id);
              }, 500);
            }}
          />
        </Tooltip>
        <Tooltip title="Xem chi nhánh">
          <Link
            to={routeLink.EM_BRANCHES + routePath.LIST + `/${id}`}
            target="_blank"
          >
            <Icon
              className="test"
              style={{ padding: 5, margin: 2 }}
              type={"container"}
            />
          </Link>
        </Tooltip>
        <Popconfirm
          placement="topRight"
          title={"Xóa "}
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
      width: 50,
      dataIndex: "index",
      key: "index",
      className: "action",
      fixed: "left",
    },
    {
      title: "Logo",
      dataIndex: "logoUrl",
      className: "action",
      key: "logoUrl",
      width: 50,
    },
    {
      title: "Xác thực",
      dataIndex: "profileVerified",
      className: "action",
      key: "profileVerified",
      width: 100,
    },
    {
      title: "Tên nhà tuyển dụng",
      dataIndex: "employerName",
      className: "action",
      key: "employerName",
      width: 240,
    },
    {
      title: "Email",
      dataIndex: "email",
      className: "action",
      key: "email",
      width: 100,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      className: "action",
      key: "phone",
      width: 100,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      className: "action",
      key: "createdDate",
      width: 200,
    },
    {
      title: "Thao tác",
      key: "operation",
      fixed: "right",
      className: "action",
      width: 80,
      render: () => this.EditToolAction(),
    },
  ];

  onToggleDrawer = () => {
    let { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  static getDerivedStateFromProps(
    nextProps?: IEmControllerListProps,
    prevState?: IEmControllerListState
  ) {
    if (
      nextProps.list_user_controller &&
      nextProps.list_user_controller !== prevState.list_user_controller
    ) {
      let { pageIndex, pageSize } = prevState;
      let dataTable = [];
      nextProps.list_user_controller.forEach(
        (item: IEmController, index: number) => {
          dataTable.push({
            key: item.id,
            index:
              index +
              (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) +
              1,
            employerName: item.employerName ? item.employerName : "",
            email: item.email ? item.email : "",
            phone: item.phone ? item.phone : "",
            logoUrl: (
              <Avatar
                size="large"
                shape="square"
                src={item.logoUrl}
                icon="shop"
              />
            ),
            profileVerified: (
              <Tooltip
                title={item.profileVerified ? "Xác thực" : "Chưa xác thực"}
              >
                <Icon
                  style={{ color: item.profileVerified ? "green" : "red" }}
                  type={"safety-certificate"}
                />
              </Tooltip>
            ),
            createdDate:
              item.createdDate !== -1
                ? timeConverter(item.createdDate, 1000)
                : "",
          });
        }
      );
      return {
        list_user_controller: nextProps.list_user_controller,
        dataTable,
        loadingTable: false,
      };
    }

    return { loadingTable: false };
  }

  async componentDidMount() {
    await this.searchEmControllers();
  }

  handleId = (event) => {
    if (event.key) {
      this.setState({ id: event.key });
    }
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


  setPageIndex = async (event: any) => {
    await this.setState({
      pageIndex: event.current - 1,
      loadingTable: true,
      pageSize: event.pageSize,
    });
    await this.searchEmControllers();
  };

  searchEmControllers = async () => {
    let { pageIndex, pageSize, body } = this.state;
    await this.props.getListEmControllers(pageIndex, pageSize, body);
  };

  createRequest = async (type?: string) => {
    let { id } = this.state;
    let { employerDetail } = this.props;
    let method = null;
    let api = EM_CONTROLLER;
    let body = null;
    await this.setState({ loading: true });
    switch (type) {
      case TYPE.DELETE:
        method = DELETE;
        body = [id];
        break;
      case TYPE.CERTIFICATE:
        method = PUT;
        api =
          api +
          `/${id}/profile/verified/${
          employerDetail.profileVerified ? "false" : "true"
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
          if (type !== TYPE.DELETE) {
            this.props.handleDrawer({ openDrawer: false });
          }
          setTimeout(() => {
            this.searchEmControllers();
          }, 500);
        }
      })
      .finally(() => {
        this.setState({ loading: false });
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
    if (type !==TYPE.EM_CONTROLLER.employerName ) {
      this.searchEmControllers();
    }
  };

  handleVisible = () => {
    let { openImport } = this.state;
    this.setState({ openImport: !openImport });
  };

  searchFilter = async () => {   // change index to 0 when start searching
    await this.setState({
      pageIndex: 0,
    });
    this.searchEmControllers();
  };

  render() {
    let { dataTable, loadingTable, loading, openImport, visible, newPassword } = this.state;
    let { totalItems, listRegions, employerDetail } = this.props;

    return (
      <>
        <DrawerConfig width={"50vw"} title={"Thông tin nhà tuyển dụng"}>
          <EmInfo data={employerDetail} />
          <Button
            type={employerDetail.profileVerified ? "danger" : "primary"}
            icon={
              loading
                ? "loading"
                : employerDetail.profileVerified
                  ? "dislike"
                  : "like"
            }
            style={{ float: "right" }}
            onClick={() => this.createRequest(TYPE.CERTIFICATE)}
          >
            {employerDetail.profileVerified ? "Hủy xác thực" : " Xác thực"}
          </Button>
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
        <EmInsertExels
          openImport={openImport}
          handleImport={() => this.handleVisible()}
        />
        <div className="common-content">
          <h5>
            Danh sách nhà tuyển dụng
            {/* <Button
              icon="filter"
              onClick={() => this.searchFilter()}
              type="primary"
              style={{
                float: "right",
              }}
            >
              Lọc
            </Button> */}
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
          </h5>
          <Row>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <IptLetterP value={"Tên tài khoản"}>
                <Input
                  placeholder="ex: daipham.uet@gmail.com"
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event.target.value,
                      TYPE.EM_CONTROLLER.username
                    )
                  }
                  onKeyDown={(event: any) => {
                    if (event.keyCode === 13) {
                      this.searchFilter();
                    }
                  }}
                />
              </IptLetterP>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <IptLetterP value={"Tên nhà tuyển dụng"}>
                <Input
                  placeholder="ex: works"
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event.target.value,
                      TYPE.EM_CONTROLLER.employerName
                    )
                  }
                  onPressEnter={() => {
                    this.searchFilter();
                  }
                  }
                />
              </IptLetterP>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <IptLetterP value={"Tỉnh thành"} />
              <Select
                showSearch
                defaultValue="Tất cả"
                style={{ width: "100%" }}
                onChange={(event: any) =>
                  this.onChangeFilter(event, TYPE.EM_CONTROLLER.regionID)
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
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <IptLetterP value={"Trạng thái xác thực"} />
              <Select
                showSearch
                style={{ width: "100%" }}
                defaultValue="Tất cả"
                onChange={(event?: any) =>
                  this.onChangeFilter(event, TYPE.EM_CONTROLLER.profileVerified)
                }
              >
                <Select.Option key="1" value={null}>
                  Tất cả
                </Select.Option>
                <Select.Option key="2" value={TYPE.TRUE}>
                  Đã xác thực
                </Select.Option>
                <Select.Option key="3" value={TYPE.FALSE}>
                  Không xác thực
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <div className="table-operations">
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
  getListEmControllers: (
    pageIndex: number,
    pageSize: number,
    body?: IEmController
  ) =>
    dispatch({
      type: REDUX_SAGA.EM_CONTROLLER.GET_EM_CONTROLLER,
      pageIndex,
      pageSize,
      body,
    }),
  getEmployerDetail: (id?: string) =>
    dispatch({ type: REDUX_SAGA.EM_CONTROLLER.GET_EM_CONTROLLER_DETAIL, id }),
  handleDrawer: (drawerState?: IDrawerState) =>
    dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
  importFile: (params?: IImportCan) =>
    dispatch({ type: REDUX.IMPORT.POST_IMPORT_EM }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
  list_user_controller: state.EmControllers.items,
  listRegions: state.Regions.items,
  employerDetail: state.EmployerDetail,
  totalItems: state.EmControllers.totalItems,
  drawerState: state.MutilBox.drawerState,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EmControllerList);
