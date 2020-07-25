import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  Icon,
  Table,
  Button,
  Row,
  Col,
  Popover,
  Modal,
  Popconfirm,
} from "antd";
import { REDUX_SAGA } from "../../../../../../const/actions";
import { ILanguages } from "../../../../../../models/languages";
import { _requestToServer } from "../../../../../../services/exec";
import { POST, PUT, DELETE } from "../../../../../../const/method";
import { LANGUAGES } from "../../../../../../services/api/private.api";
import { TYPE } from "../../../../../../const/type";
import { InputTitle } from "../../../../layout/input-tittle/InputTitle";
import { Link } from "react-router-dom";

interface ListLanguagesProps extends StateProps, DispatchProps {
  match: Readonly<any>;
  getListLanguages: Function;
}

interface ListLanguagesState {
  listSkills: Array<ILanguages>;
  loadingTable: boolean;
  dataTable: Array<any>;
  pageIndex: number;
  pageSize: number;
  openModal: boolean;
  name?: string;
  id?: string;
  type?: string;
  search?: string;
}

class ListLanguages extends PureComponent<
  ListLanguagesProps,
  ListLanguagesState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      listSkills: [],
      loadingTable: true,
      dataTable: [],
      pageIndex: 0,
      pageSize: 10,
      openModal: false,
      name: "",
      id: "",
      type: TYPE.EDIT,
      search: undefined,
    };
  }

  async componentDidMount() {
    await this.props.getListLanguages(0, 10);
  }

  static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
    if (nextProps.listSkills !== prevState.listSkills) {
      let dataTable: any = [];
      let { pageIndex, pageSize } = prevState;
      nextProps.listSkills.forEach((item: any, index: number) => {
        dataTable.push({
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
        dataTable,
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
        onClick={() => this.toggleModal(true, TYPE.EDIT)}
      />
      <Popconfirm
        trigger="click"
        title="Bạn muốn xóa ngôn ngữ ngày"
        onConfirm={() => this.removeLanguages()}
        okType="danger"
        okText="Xóa"
        children={
          <Icon
            className="test"
            style={{ padding: 5, margin: 2 }}
            type="delete"
            theme="twoTone"
            twoToneColor="red"
          />
        }
      />
    </>
  );

  columns = [
    {
      title: "STT",
      width: 50,
      dataIndex: "index",
      key: "index",
      className: "action",
    },
    {
      title: "Tên ngôn ngữ",
      dataIndex: "name",
      key: "name",
      className: "action",
      width: 300,
    },
    {
      title: "Thao tác",
      key: "operation",
      className: "action",
      width: 100,
      render: () => this.EditContent,
    },
  ];

  setPageIndex = async (event: any) => {
    await this.setState({
      pageIndex: event.current - 1,
      loadingTable: true,
      pageSize: event.pageSize,
    });
    this.props.getListLanguages(event.current - 1, event.pageSize);
  };

  addLanguage = async () => {
    let { name } = this.state;
    if (name) {
      await _requestToServer(POST, LANGUAGES, {
        name: name.trim(),
      }).then((res: any) => {
        this.props.getListLanguages();
      });
    }
  };

  editLanguage = async () => {
    let { name, id } = this.state;
    if (name) {
      await _requestToServer(PUT, LANGUAGES + `/${id}`, {
        name: name.trim(),
      }).then((res: any) => {
        this.props.getListLanguages();
      });
    }
  };

  removeLanguages = async () => {
    let { id } = this.state;
    await _requestToServer(DELETE, LANGUAGES, [id]).then((res: any) => {
      this.props.getListLanguages();
    });
  };

  getModalTitle = () => {
    let { type } = this.state;
    if (type) {
      switch (type) {
        case TYPE.CREATE:
          return "Thêm ngôn ngữ";
        case TYPE.EDIT:
          return "Cập nhật ngôn ngữ";
      }
    }
  };

  toggleModal = (visible?: boolean, type?: string) => {
    let { openModal } = this.state;
    this.setState({
      openModal: !openModal,
      type,
    });
  };

  render() {
    let {
      dataTable,
      loadingTable,
      openModal,
      name,
      type,
      // pageIndex,
      // pageSize,
      // search
    } = this.state;
    let { totalItems } = this.props;
    return (
      <>
        <Modal
          title={this.getModalTitle()}
          visible={openModal}
          width={500}
          onOk={() => {
            if (type === TYPE.CREATE) {
              this.addLanguage();
            } else if (type === TYPE.EDIT) {
              this.editLanguage();
              this.toggleModal();
            }
          }}
          onCancel={() => {
            this.setState({ openModal: false });
          }}
        >
          <InputTitle
            title="Tên ngôn ngữ*"
            type={TYPE.INPUT}
            value={name}
            placeholder="Tên ngôn ngữ "
            onChange={(event: any) => this.setState({ name: event })}
            widthInput="500px"
          />
        </Modal>
        <div>
          <Row gutter={10}>
            <Col span={10}>
              <h4>Danh sách ngôn ngữ</h4>
            </Col>
            <Col span={1}>
              <Popover content="Xóa đã chọn" trigger="click">
                <Button
                  onClick={() => {}}
                  shape="circle"
                  type="danger"
                  icon="delete"
                ></Button>
              </Popover>
            </Col>
            <Col span={1}>
              <Popover content="Thêm mới" trigger="hover">
                <Link to="/admin/data/languages/create">
                  <Button shape="circle" type="primary" icon="plus" />
                </Link>
              </Popover>
            </Col>
          </Row>
          <Row>
            <Col span={2} />
            <Col span={20}>
              <Table
                // @ts-ignore
                columns={this.columns}
                loading={loadingTable}
                dataSource={dataTable}
locale={{ emptyText: 'Không có dữ liệu' }}
                useFixedHeader={true}
                scroll={{ y: 500 }}
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
          </Row>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
  getListLanguages: (pageIndex: number, pageSize: number, name?: string) =>
    dispatch({
      type: REDUX_SAGA.LANGUAGES.GET_LANGUAGES,
      pageIndex,
      pageSize,
      name,
    }),
});

const mapStateToProps = (state: any, ownProps?: any) => ({
  listSkills: state.Languages.items,
  totalItems: state.Languages.totalItems,
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListLanguages);
