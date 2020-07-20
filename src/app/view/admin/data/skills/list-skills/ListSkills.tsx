import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Icon, Table, Button, Row, Col, Input } from "antd";
import { REDUX_SAGA } from "../../../../../../const/actions";
import { ISkills } from "../../../../../../models/skills";
import { Link } from "react-router-dom";
import { ModalConfig } from "../../../../layout/modal-config/ModalConfig";
import { InputTitle } from "../../../../layout/input-tittle/InputTitle";
import { _requestToServer } from "../../../../../../services/exec";
import { PUT, DELETE } from "../../../../../../const/method";
import { SKILLS } from "../../../../../../services/api/private.api";
import { TYPE } from "../../../../../../const/type";
import { routeLink, routePath } from "../../../../../../const/break-cumb";

interface ListSkillsProps extends StateProps, DispatchProps {
  match: Readonly<any>;
  getListSkills: Function;
}

interface ListSkillsState {
  listSkills: Array<ISkills>;
  loadingTable: boolean;
  data_table: Array<any>;
  pageIndex: number;
  pageSize: number;
  openModal: boolean;
  name?: string;
  id?: string;
  type?: string;
  search?: string;
}

class ListSkills extends PureComponent<ListSkillsProps, ListSkillsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      listSkills: [],
      loadingTable: true,
      data_table: [],
      pageIndex: 0,
      pageSize: 10,
      openModal: false,
      name: undefined,
      id: undefined,
      type: TYPE.EDIT,
      search: undefined,
    };
  }

  async componentDidMount() {
    await this.props.getListSkills(0, 10);
  }

  static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
    if (nextProps.listSkills !== prevState.listSkills) {
      let data_table: any = [];
      let { pageIndex, pageSize } = prevState;
      nextProps.listSkills.forEach((item: any, index: any) => {
        data_table.push({
          key: item.id,
          index:
            index +
            (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) +
            1,
          name: item.name,
        });
      });

      return {
        listSkills: nextProps.listSkills,
        data_table,
        loadingTable: false,
      };
    }
    return { loadingTable: false };
  }

  EditContent = (
    <>
      <Icon
        className="test"
        key="edit"
        style={{ padding: 5, margin: 2 }}
        type="edit"
        theme="twoTone"
        onClick={() => this.toggleModal(TYPE.EDIT)}
      />
      <Icon
        className="test"
        style={{ padding: 5, margin: 2 }}
        type="delete"
        theme="twoTone"
        twoToneColor="red"
        onClick={() => this.toggleModal(TYPE.DELETE)}
      />
    </>
  );

  toggleModal = (type?: string) => {
    let { openModal } = this.state;
    this.setState({ openModal: !openModal });
    if (type) {
      this.setState({ type });
    }
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
      title: "Tên kỹ năng",
      dataIndex: "name",
      key: "name",
      width: 250,
      className: "action",
    },
    {
      title: "Thao tác",
      key: "operation",
      className: "action",
      width: 100,
      fixed: "right",
      render: () => this.EditContent,
    },
  ];

  setPageIndex = async (event: any) => {
    await this.setState({
      pageIndex: event.current - 1,
      loadingTable: true,
      pageSize: event.pageSize,
    });
    this.props.getListSkills(event.current - 1, event.pageSize);
  };

  editSkills = async () => {
    let { name, id } = this.state;
    if (name) {
      await _requestToServer(PUT, SKILLS + `/${id}`, {
        name: name.trim(),
      }).then((res: any) => {
        if (res && res.code === 200) {
          this.props.getListSkills();
          this.toggleModal();
        }
      });
    }
  };

  removeSkills = async () => {
    let { id } = this.state;
    await _requestToServer(DELETE, SKILLS, [id]).then((res) => {
      this.props.getListSkills();
      this.toggleModal();
    });
  };

  render() {
    let {
      data_table,
      loadingTable,
      openModal,
      name,
      type,
      pageIndex,
      pageSize,
      search,
    } = this.state;
    let { totalItems } = this.props;
    return (
      <>
        <ModalConfig
          title={type === TYPE.EDIT ? "Sửa kỹ năng" : "Xóa kỹ năng"}
          namebtn1="Hủy"
          namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
          isOpen={openModal}
          toggleModal={() => {
            this.setState({ openModal: !openModal });
          }}
          handleOk={async () =>
            type === TYPE.EDIT ? this.editSkills() : this.removeSkills()
          }
          handleClose={async () => this.toggleModal()}
        >
          {type === TYPE.EDIT ? (
            <InputTitle
              title="Sửa tên tỉnh"
              type={TYPE.INPUT}
              value={name}
              placeholder="Tên tỉnh"
              onChange={(event: any) => this.setState({ name: event })}
              widthInput="250px"
            />
          ) : (
            <div>Bạn chắc chắn sẽ xóa kỹ năng: {name}</div>
          )}
        </ModalConfig>
        <Row>
          <Col sm={12} md={8} lg={5} xl={6} xxl={8} />
          <Col sm={12} md={8} lg={14} xl={12} xxl={8}>
            <h5>
              Danh sách kỹ năng
              <Button
                onClick={() => {}}
                type="primary"
                style={{
                  float: "right",
                }}
              >
                <Link to={routeLink.SKILLS + routePath.CREATE}>
                  <Icon type="plus" />
                  Thêm mới
                </Link>
              </Button>
            </h5>
            <Row>
              <Col sm={12} md={12} lg={12} xl={12} xxl={12}>
                <Input
                  placeholder="Tất cả"
                  style={{ width: "100%" }}
                  value={search}
                  onChange={(event: any) =>
                    this.setState({ search: event.target.value })
                  }
                  onPressEnter={(event: any) =>
                    this.props.getListSkills(pageIndex, pageSize, search)
                  }
                  suffix={
                    search && search.length > 0 ? (
                      <Icon
                        type={"close-circle"}
                        theme={"filled"}
                        onClick={() => this.setState({ search: null })}
                      />
                    ) : (
                      <Icon type={"search"} />
                    )
                  }
                />
              </Col>
            </Row>
            <Table
              // @ts-ignore
              columns={this.columns}
              loading={loadingTable}
              dataSource={data_table}
              scroll={{ x: 400 }}
              bordered
              pagination={{ total: totalItems, showSizeChanger: true }}
              size="middle"
              onChange={this.setPageIndex}
              onRow={(event) => ({
                onClick: () =>
                  this.setState({ id: event.key, name: event.name }),
              })}
            />
          </Col>
          <Col sm={12} md={8} lg={5} xl={6} xxl={8} />
        </Row>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
  getListSkills: (pageIndex: number, pageSize: number, name?: string) =>
    dispatch({ type: REDUX_SAGA.SKILLS.GET_SKILLS, pageIndex, pageSize, name }),
});

const mapStateToProps = (state: any, ownProps?: any) => ({
  listSkills: state.Skills.items,
  totalItems: state.Skills.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListSkills);
