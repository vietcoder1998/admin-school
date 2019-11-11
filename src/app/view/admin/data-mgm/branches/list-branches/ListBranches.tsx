import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { ILanguage } from '../../../../../../redux/models/languages';
import { Link } from 'react-router-dom';
import { ConfigModal } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { PUT, DELETE } from '../../../../../../common/const/method';
import { BRANCHES } from '../../../../../../services/api/private.api';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { TYPE } from '../../../../../../common/const/type';

interface ListBranchesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListBranches: Function;
}

interface ListBranchesState {
    list_branches: Array<ILanguage>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
}

class ListBranches extends PureComponent<ListBranchesProps, ListBranchesState> {
    constructor(props) {
        super(props);
        this.state = {
            list_branches: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            openModal: false,
            name: "",
            id: "",
            type: TYPE.EDIT,
        }
    }

    async componentDidMount() {
        await this.props.getListBranches(0, 10);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_branches !== prevState.list_branches) {
            let data_table = [];
            let { pageIndex } = prevState;
            nextProps.list_branches.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    name: item.name,
                });
            })

            return {
                list_branches: nextProps.list_branches,
                data_table,
                loading_table: false
            }
        }
        return null;
    }


    EditContent = (
        <div>
            <Icon style={{ padding: "5px 10px" }} type="delete" onClick={() => this.toggleModal(TYPE.DELETE)} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" onClick={() => this.toggleModal(TYPE.EDIT)} />
        </div>
    )

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        this.setState({ openModal: !openModal });
        if (type) {
            this.setState({ type })
        }
    }

    columns = [
        {
            title: '#',
            width: 150,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Nhóm ngành',
            dataIndex: 'name',
            key: 'name',
            width: 700,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 300,
            fixed: "right",
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true });
        this.props.getListBranches(event.current - 1)
    }

    editBranches = async () => {
        let { name, id } = this.state;
        name = name.trim();
        await _requestToServer(
            PUT,
            { name },
            BRANCHES + `/${id}`,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListBranches();
                this.toggleModal();
            }
        })
    }

    removeBranches = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE,
            [id],
            BRANCHES,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListBranches();
                this.toggleModal();
            }
        })
    }


    render() {
        let { data_table, loading_table, openModal, name, type } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <ConfigModal
                    title={type === TYPE.EDIT ? "Sửa chuyên nghành" : "Xóa chuyên nghành"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => { this.setState({ openModal: !openModal }) }}
                    handleOk={async () => type === TYPE.EDIT ? this.editBranches() : this.removeBranches()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên chuyên nghành"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tên chuyên nghành"
                            onChange={event => this.setState({ name: event })}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóa chuyên nghành : {name}</div>
                    }
                </ConfigModal>
                <div>
                    <h5>
                        Danh sách chuyên nghành
                        <Button
                            onClick={() => { }}
                            type="primary"
                            size="default"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to='/admin/data/branches/create'>
                                <Icon type="plus" />
                                Thêm chuyên nghành mới
                            </Link>
                        </Button>
                    </h5>
                    <Table
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table} scroll={{ x: 1000 }}
                        bordered
                        pagination={{ total: totalItems }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRowClick={event => { console.log(event); this.setState({ id: event.key, name: event.name }) }}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListBranches: (pageIndex, pageSize) => dispatch({ type: REDUX_SAGA.BRANCHES.GET_BRANCHES, pageIndex, pageSize })
})

const mapStateToProps = (state, ownProps) => ({
    list_branches: state.Branches.items,
    totalItems: state.Branches.totalItems
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListBranches)