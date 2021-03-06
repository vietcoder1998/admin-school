import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  Table,
  Icon,
  Popconfirm,
  Col,
  Select,
  Row,
  Tooltip,
  Modal,
} from "antd";
import "./UserControllerList.scss";
import { timeConverter } from "./../../../../../../utils/convertTime";
import { IAppState } from "./../../../../../../redux/store/reducer";
import { REDUX_SAGA } from "./../../../../../../const/actions";
import { _requestToServer } from "./../../../../../../services/exec";
import { DELETE, PUT } from "./../../../../../../const/method";
import { USER_CONTROLLER } from "./../../../../../../services/api/private.api";
import { TYPE } from "./../../../../../../const/type";
import { IptLetterP } from "./../../../../layout/common/Common";
import {
  IUserController,
  IUserControllerFilter,
} from "./../../../../../../models/user-controller";
import { InputTitle } from "../../../../layout/input-tittle/InputTitle";
import Search from "antd/lib/input/Search";


interface IUserControllerListProps extends StateProps, DispatchProps {
  match?: any;
  history?: any;
  location?: any;
  getListUserControllers: Function;
  getAnnoucementDetail: Function;
}

interface IUserControllerListState {
  dataTable?: Array<any>;
  search?: any;
  pageIndex?: number;
  pageSize?: number;
  showModal?: boolean;
  loading?: boolean;
  valueType?: string;
  id?: string;
  loadingTable?: boolean;
  body?: IUserControllerFilter;
  listUserController?: Array<IUserController>;
  banned_state?: string;
  filter?: any;
  visible?: boolean;
  newPassword?: string;
}

class UserControllerList extends PureComponent<IUserControllerListProps, IUserControllerListState> {
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
      banned_state: null,
      body: {
        username: null,
        email: null,
        banned: null,
        activated: null,
        createdDate: null,
        lastActive: null,
      },
      listUserController: [],
      visible: false,
      newPassword: null,
      filter: {
        offset: 0,
        limit: 10,
        startTime: null,
        endTime: null,
      },
    };
  }

  EditToolAction = () => {
    let { body } = this.state;
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
        <Popconfirm
          placement="topRight"
          title={"Xóa khỏi danh sách"}
          onConfirm={() => this.createRequest(TYPE.DELETE)}
          okType={"danger"}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Tooltip title="Xóa người dùng ">
            <Icon
              className="test"
              style={{ padding: 5, margin: 2 }}
              type="delete"
              theme="twoTone"
              twoToneColor="red"
            />
          </Tooltip>
        </Popconfirm>
        <Popconfirm
          placement="topRight"
          title={body.banned ? "Hủy chặn người dùng" : "Chặn người dùng này"}
          onConfirm={() => this.createRequest(TYPE.BAN)}
          okType={body.banned ? "primary" : "danger"}
          okText={body.banned ? "Hủy chặn" : "Chặn"}
          cancelText="Hủy"
        >
          <Tooltip title="Chặn người dùng ">
            <Icon
              className="test"
              style={{ padding: 5, margin: 2 }}
              type={body.banned ? "check-circle" : "stop"}
              theme={"twoTone"}
              twoToneColor={body.banned ? "blue" : "red"}
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
      title: "Tên tài khoản",
      dataIndex: "username",

      key: "username",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",

      key: "email",
      width: 200,
    },
    {
      title: "Trạng thái cấm",
      dataIndex: "banned",
      className: "action",
      key: "banned",
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
      title: "Đăng nhập cuối",
      dataIndex: "lastActive",
      className: "action",
      key: "lastActive",
      width: 100,
    },
    {
      title: "Thao tác",
      key: "operation",
      fixed: "right",
      className: "action",
      width: 120,
      render: () => this.EditToolAction(),
    },
  ];

  onToggleModal = () => {
    let { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };

  static getDerivedStateFromProps(
    nextProps?: IUserControllerListProps,
    prevState?: IUserControllerListState
  ) {
    if (
      nextProps.listUserController &&
      nextProps.listUserController !== prevState.listUserController
    ) {
      let { pageIndex, pageSize } = prevState;
      let dataTable = [];
      nextProps.listUserController.forEach(
        (item: IUserController, index: number) => {
          dataTable.push({
            key: item.id,
            index:
              index +
              (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) +
              1,
            username: item.username ? item.username : "Chưa cập nhật",
            email: item.email ? item.email : "Chưa cập nhật",
            banned: item.banned ? "true" : "false",
            lastActive:
              item.lastActive !== -1
                ? timeConverter(item.lastActive, 1000)
                : "Không có",
            createdDate: timeConverter(item.createdDate, 1000),
          });
        }
      );
      return {
        listUserController: nextProps.listUserController,
        dataTable,
        loadingTable: false
      };
    }
    return null;
  }

  async componentDidMount() {
    await this.searchUserControllers();
  }

  handleId = (event) => {
    if (event.key) {
      this.setState({ id: event.key });
    }
  };

  setPageIndex = async (event: any) => {
    await this.setState({
      pageIndex: event.current - 1,
      pageSize: event.pageSize,
    });
    await this.searchUserControllers();
  };

  searchUserControllers = async () => {
    let { pageIndex, pageSize, body } = this.state;
    this.setState({ loadingTable: true });
    await this.props.getListUserControllers(pageIndex, pageSize, body);
  };

  searchFilter = async () => {
    await this.setState({
      pageIndex: 0,
    });
    this.searchUserControllers();
  };

  createRequest = async (type?: string) => {
    let { id, banned_state } = this.state;
    let method = null;
    let api = USER_CONTROLLER;
    switch (type) {
      case TYPE.DELETE:
        method = DELETE;
        break;
      case TYPE.BAN:
        method = PUT;
        api = api + `/banned/${banned_state === "true" ? "false" : "true"}`;
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
        this.searchUserControllers();
      }
    });
  };

  onChangeFilter = async (value?: any, type?: string) => {
    let { body } = this.state;
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
    if (type !== TYPE.USER_CONTROLLER.username && type !== TYPE.USER_CONTROLLER.email) {
      this.searchUserControllers();
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

  render() {
    let { dataTable, loadingTable, visible, newPassword, loading } = this.state;
    let { totalItems } = this.props;
    return (
      <>
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
            Danh sách người dùng ({totalItems})
          </h5>
          <div className="table-operations">
            <Row>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
                <IptLetterP value={"Tên tài khoản"}>
                  <Search
                    placeholder="ex: works"
                    onChange={(event: any) =>
                      this.onChangeFilter(
                        event.target.value,
                        TYPE.USER_CONTROLLER.username
                      )
                    }
                    onPressEnter={() => this.searchFilter()}
                  />
                </IptLetterP>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
                <IptLetterP value={"Địa chỉ Email"}>
                  <Search
                    placeholder="ex: works@gmail.com"
                    onChange={(event: any) =>
                      this.onChangeFilter(
                        event.target.value,
                        TYPE.USER_CONTROLLER.email
                      )
                    }
                    onPressEnter={() => this.searchFilter()}
                  />
                </IptLetterP>
              </Col>
              <Col xs={24} sm={12} md={8} lg={3} xl={3} xxl={3}>
                <IptLetterP value={"Hoạt động"} />
                <Select
                  showSearch
                  placeholder="Tất cả"
                  optionFilterProp="children"
                  defaultValue="Tất cả"
                  style={{ width: "100%" }}
                  onChange={(event?: any) =>
                    this.onChangeFilter(event, TYPE.USER_CONTROLLER.activated)
                  }
                >
                  <Select.Option key="1" value={null}>
                    Tất cả
                </Select.Option>
                  <Select.Option key="3" value={TYPE.TRUE}>
                    Có
                </Select.Option>
                  <Select.Option key="4" value={TYPE.FALSE}>
                    Không 
                </Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={3} xl={3} xxl={3}>
                <IptLetterP value={"Bị cấm"} />
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  defaultValue="Tất cả"
                  onChange={(event?: any) =>
                    this.onChangeFilter(event, TYPE.USER_CONTROLLER.banned)
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
            </Row>
            <Table
              // @ts-ignore
              columns={this.columns}
              loading={loadingTable}
              dataSource={dataTable}
              locale={{ emptyText: 'Không có dữ liệu' }}
              scroll={{ x: 920 }}
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
                  onClick: () => {
                    this.setState({
                      id: record.key,
                      banned_state: record.banned
                    });
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
  getListUserControllers: (
    pageIndex: number,
    pageSize: number,
    body?: IUserController
  ) =>
    dispatch({
      type: REDUX_SAGA.USER_CONTROLLER.GET_USER_CONTROLLER,
      pageIndex,
      pageSize,
      body,
    }),
  getListSChool: (
    body?: string,
    pageIndex?: number,
    pageSize?: number) =>
    dispatch({
      type: REDUX_SAGA.SCHOOLS.GET_SCHOOLS,
      body,
      pageIndex,
      pageSize
    }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
  listUserController: state.UserControllers.items,
  totalItems: state.UserControllers.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserControllerList);
