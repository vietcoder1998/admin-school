import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Row, Col, Input } from 'antd';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { ILanguage } from '../../../../../../models/languages';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { PUT, DELETE } from '../../../../../../const/method';
import { BRANCHES } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../const/type';
import { routeLink, routePath } from '../../../../../../const/break-cumb';

interface ListBranchesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListBranches: Function;
};

interface ListBranchesState {
    listBranches: Array<ILanguage>,
    loadingTable: boolean;
    dataTable: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
    search?: string;
};

class ListBranches extends PureComponent<ListBranchesProps, ListBranchesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            listBranches: [],
            loadingTable: true,
            dataTable: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            name: "",
            id: "",
            type: TYPE.EDIT,
            search: undefined
        }
    };

    async componentDidMount() {
        await this.props.getListBranches(0, 10);
    };

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.listBranches !== prevState.listBranches) {
            let dataTable: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.listBranches.forEach((item: any, index: number) => {
                dataTable.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                });
            });

            return {
                listBranches: nextProps.listBranches,
                dataTable,
                loadingTable: false
            }
        }
        return { loadingTable: false };
    };


    EditContent = (
        <>
            <Icon
                className="test"
                key="edit"
                style={{ padding: 5, margin: 2 }}
                type="edit"
                theme="twoTone"
                onClick={
                    () => this.toggleModal(TYPE.EDIT)
                }
            />
            <Icon
                className="test"
                style={{ padding: 5, margin: 2 }}
                type="delete"
                theme="twoTone"
                twoToneColor="red"
                onClick={
                    () => this.toggleModal(TYPE.DELETE)
                }
            />
        </>
    );

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        this.setState({ openModal: !openModal });
        if (type) {
            this.setState({ type })
        }
    };

    columns = [
        {
            title: '#',
            width: 50,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
            fixed: 'left'
        },
        {
            title: 'Nhóm ngành',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            className: 'action'
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            className: 'action',
            width: 100,
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        this.props.getListBranches(event.current - 1, event.pageSize)
    };

    editBranches = async () => {
        let { name, id } = this.state;
        if (name) {
            await _requestToServer(
                PUT, BRANCHES + `/${id}`,
                { name }
            ).then((res: any) => {
                if (res && res.code === 200) {
                    this.props.getListBranches();
                    this.toggleModal();
                }
            })
        }
    };

    removeBranches = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, BRANCHES,
            [id]
        ).then((res: any) => {
            this.props.getListBranches();
            this.toggleModal();
        })
    };

    render() {
        let { dataTable, loadingTable, openModal, name, type, pageIndex, pageSize, search } = this.state;
        let { totalItems } = this.props;
        return <>
            <ModalConfig
                title={type === TYPE.EDIT ? "Sửa nhóm ngành" : "Xóa nhóm ngành"}
                namebtn1="Hủy"
                namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                isOpen={openModal}
                toggleModal={() => {
                    this.setState({ openModal: !openModal })
                }}
                handleOk={async () => type === TYPE.EDIT ? this.editBranches() : this.removeBranches()}
                handleClose={async () => this.toggleModal()}
            >
                {type === TYPE.EDIT ?
                    (<InputTitle
                        title="Sửa tên nhóm ngành"
                        type={TYPE.INPUT}
                        value={name}
                        placeholder="Tên nhóm ngành"
                        onChange={(event: any) => this.setState({ name: event })}
                        widthInput="250px"
                    />) : <div>Bạn chắc chắn sẽ xóa nhóm ngành : {name}</div>
                }
            </ModalConfig>
            <Row>
                <Col md={2} lg={5} xl={6} xxl={8} />
                <Col md={20} lg={14} xl={12} xxl={8}>
                    <h5>
                        Danh sách nhóm ngành
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to={routeLink.BRANCHES + routePath.CREATE}>
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
                                onChange={(event: any) => this.setState({ search: event.target.value })}
                                onPressEnter={(event: any) => this.props.getListBranches(pageIndex, pageSize, search)}
                                suffix={
                                    search &&
                                        search.length > 0 ?
                                        <Icon
                                            type={"close-circle"}
                                            theme={"filled"}
                                            onClick={
                                                () => this.setState({ search: null })
                                            }
                                        /> : <Icon type={"search"} />
                                }
                            />
                        </Col>
                    </Row>
                    <Table
                        // @ts-ignore
                        columns={this.columns}
                        loading={loadingTable}
                        dataSource={dataTable}
locale={{ emptyText: 'Không có dữ liệu' }}
                        scroll={{ x: 400 }}
                        bordered
                        pagination={{ total: totalItems, showSizeChanger: true }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRow={(event) => ({ onClick: () => this.setState({ id: event.key, name: event.name }) })}
                    />
                </Col>
                <Col md={2} lg={5} xl={6} xxl={8} />
            </Row>
        </>
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListBranches: (pageIndex: number, pageSize: number, name?: string) => dispatch({ type: REDUX_SAGA.BRANCHES.GET_BRANCHES, pageIndex, pageSize, name })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    listBranches: state.Branches.items,
    totalItems: state.Branches.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListBranches)