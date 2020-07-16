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

interface IUserControllerListProps extends StateProps, DispatchProps {
  match?: any;
  history?: any;
  location?: any;
  getListUserControllers: Function;
  getAnnoucementDetail: Function;
}

interface IUserControllerListState {
  data_table?: Array<any>;
  search?: any;
  pageIndex?: number;
  pageSize?: number;
  showModal?: boolean;
  loading?: boolean;
  valueType?: string;
  id?: string;
  loadingTable?: boolean;
  body?: IUserControllerFilter;
  list_user_controller?: Array<IUserController>;
  banned_state?: string;
}

class UserControllerList extends PureComponent<
  IUserControllerListProps,
  IUserControllerListState
> {
  constructor(props) {
    super(props);
    this.state = {
      data_table: [],
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
      list_user_controller: [],
    };
  }

  EditToolAction = () => {
    let { body } = this.state;
    return (
      <>
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
          title: '#',
          width: 50,
          dataIndex: 'index',
          key: 'index',
          className: 'action',
          fixed: 'left',
      },
      {
          title: 'Tên tài khoản',
          dataIndex: 'username',
         
          key: 'username',
          width: 200,
         
      },
      {
          title: 'Email',
          dataIndex: 'email',
          
          key: 'email',
          width: 200,
      },
      {
          title: 'Trạng thái cấm',
          dataIndex: 'banned',
          className: 'action',
          key: 'banned',
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
          title: 'Đăng nhập cuối',
          dataIndex: 'lastActive',
          className: 'action',
          key: 'lastActive',
          width: 100,
      },
      {
          title: 'Thao tác',
          key: 'operation',
          fixed: 'right',
          className: 'action',
          width: 100,
          render: () => this.EditToolAction()
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
      nextProps.list_user_controller &&
      nextProps.list_user_controller !== prevState.list_user_controller
    ) {
      let { pageIndex, pageSize } = prevState;
      let data_table = [];
      nextProps.list_user_controller.forEach(
        (item: IUserController, index: number) => {
          data_table.push({
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
        list_user_controller: nextProps.list_user_controller,
        data_table,
        loadingTable: false,
      };
    }
    return { loadingTable: false };
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
      loadingTable: true,
      pageSize: event.pageSize,
    });
    await this.searchUserControllers();
  };

  searchUserControllers = async () => {
    let { pageIndex, pageSize, body } = this.state;
    
    await this.props.getListUserControllers(pageIndex, pageSize, body);
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

  onChangeFilter = (value?: any, type?: string) => {
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
  };

  render() {
    let { data_table, loadingTable } = this.state;

    let { totalItems } = this.props;
    return (
      <>
        <div className="common-content">
          <h5>
            Danh sách người dùng
            <Button
              icon="filter"
              onClick={() => this.searchUserControllers()}
              type="primary"
              style={{
                float: "right",
              }}
            >
              Lọc
            </Button>
          </h5>
          <Row>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <IptLetterP value={"Tên tài khoản"}>
                <Input
                  placeholder="ex: works"
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event.target.value,
                      TYPE.USER_CONTROLLER.username
                    )
                  }
                  onKeyDown={(event: any) => {
                    if (event.keyCode === 13) {
                      this.searchUserControllers();
                    }
                  }}
                />
              </IptLetterP>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <IptLetterP value={"Địa chỉ Email"}>
                <Input
                  placeholder="ex: works@gmail.com"
                  onChange={(event: any) =>
                    this.onChangeFilter(
                      event.target.value,
                      TYPE.USER_CONTROLLER.email
                    )
                  }
                  onKeyDown={(event: any) => {
                    if (event.keyCode === 13) {
                      this.searchUserControllers();
                    }
                  }}
                />
              </IptLetterP>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <IptLetterP value={"Trạng thái hoạt động"} />
              <Select
                showSearch
                placeholder="Tất cả"
                optionFilterProp="children"
                style={{ width: "100%" }}
                onChange={(event?: any) =>
                  this.onChangeFilter(event, TYPE.USER_CONTROLLER.activated)
                }
              >
                <Select.Option key="1" value={null}>
                  Tất cả
                </Select.Option>
                <Select.Option key="3" value={TYPE.TRUE}>
                  Đang hoạt động
                </Select.Option>
                <Select.Option key="4" value={TYPE.FALSE}>
                  Không hoạt động
                </Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <IptLetterP value={"Trạng thái cấm"} />
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
                  Đang bị cấm
                </Select.Option>
                <Select.Option key="3" value={TYPE.FALSE}>
                  Không bị cấm
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <div className="table-operations">
            <Table
              // @ts-ignore
              columns={this.columns}
              loading={loadingTable}
              dataSource={data_table}
              scroll={{ x: 850 }}
              bordered
              pagination={{ total: totalItems, showSizeChanger: true }}
              size="middle"
              onChange={this.setPageIndex}
              onRow={(record: any, rowIndex: any) => {
                return {
                  onClick: () => {
                    this.setState({
                      id: record.key,
                      banned_state: record.banned,
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
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
  list_user_controller: state.UserControllers.items,
  totalItems: state.UserControllers.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(UserControllerList);
