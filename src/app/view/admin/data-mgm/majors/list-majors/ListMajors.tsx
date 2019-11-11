import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { IMajor } from '../../../../../../redux/models/majors';
import { Link } from 'react-router-dom';
import { IBranches } from '../../../../../../redux/models/branches';
import { MAJORS } from '../../../../../../services/api/private.api';
import { DELETE, PUT } from '../../../../../../common/const/method';
import { _requestToServer } from '../../../../../../services/exec';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { ConfigModal } from '../../../../layout/modal-config/ModalConfig';
import { TYPE } from '../../../../../../common/const/type';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';

interface ListMajorsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListMajors: Function;
};

interface ListMajorsState {
    list_majors: Array<IMajor>,
    list_branch?: Array<IBranches>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    name?: string;
    id?: string;
    branchName?: string;
    branchID?: number;
    type: string;
    openModal: boolean;
    list_data: Array<{label: string, value: number}>;
};

class ListMajors extends PureComponent<ListMajorsProps, ListMajorsState> {
    constructor(props) {
        super(props);
        this.state = {
            list_majors: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            list_branch: [],
            id: "",
            branchName: null,
            branchID: null,
            type: TYPE.EDIT,
            openModal: false,
        };
    };

    async componentDidMount() {
        await this.props.getListMajors(0, 10);
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_majors !== prevState.list_majors) {
            let data_table = [];
            let { pageIndex } = prevState;
            nextProps.list_majors.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    name: item.name,
                    branchName: item.branch ? item.branch.name : "Khác"
                });
            })

            return {
                list_majors: nextProps.list_majors,
                data_table,
                loading_table: false
            }
        };

        if (nextProps.list_branches !== prevState.list_branches) {
            let list_data = []
            nextProps.list_branches.forEach(item => list_data.push({ value: item.id, label: item.name }))
            return {
                list_branches: nextProps.list_branches,
                list_data,
            }
        };

        return null;
    };


    EditContent = (
        <div>
            <Icon style={{ padding: "5px 10px" }} type="delete" onClick={() => { }} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" onClick={() => { }} />
        </div>
    );

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        if (type) {
            this.setState({ type })
        }
        this.setState({ openModal: !openModal })
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
            title: 'Tên chuyên ngành',
            dataIndex: 'name',
            key: 'name',
            width: 500,
            className: 'action',

        }, {
            title: 'Nhóm ngành',
            dataIndex: 'branchName',
            key: 'branchName',
            width: 400,
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
        this.props.getListMajors(event.current - 1)
    };

    editjobNames = async () => {
        let { name, id, branchID } = this.state;
        name = name.trim();
        await _requestToServer(
            PUT,
            { name, branchID },
            MAJORS + `/${id}`,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListMajors(0);
                this.toggleModal();
            }
        })
    }

    removejobNames = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE,
            [id],
            MAJORS,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListMajors(0);
                this.toggleModal();
            }
        })
    }

    render() {
        let { data_table, loading_table, type, openModal, list_data, name } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <div>
                    <h5>
                        Danh sách ngành nghề
                        <Button
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            <Link to='/admin/data/majors/create'>
                                <Icon type="plus" />
                                Thêm ngành nghề mới
                            </Link>
                        </Button>
                    </h5>
                    <ConfigModal
                        namebtn1={"Hủy"}
                        namebtn2={"Hoàn thành"}
                        title="Thay đổi ngành nghề"
                        isOpen={openModal}
                        handleOk={() => { }}
                        toggleModal={this.toggleModal}
                    >
                        {type === TYPE.EDIT ? (
                            <Fragment>
                                <InputTitle
                                    type={TYPE.INPUT}
                                    title="Sửa tên ngành nghề"
                                    widthLabel="120px"
                                    placeholder="Thay đổi tên"
                                    widthInput={"350px"}
                                    style={{ padding: "0px 20px" }}
                                    onChange={event => this.setState({ name: event })}
                                />

                                <InputTitle
                                    type={TYPE.SELECT}
                                    title="Chọn nhóm ngành nghề"
                                    placeholder="Chọn nhóm ngành nghề"
                                    list_value={list_data}
                                    style={{ padding: "0px 30px" }}
                                    onChange={event => this.setState({ branchID: event })}
                                />
                            </Fragment>

                        ) : <div>Bạn chắc chắn muốn xóa chuyên ngành này: {name}</div>}

                    </ConfigModal>
                    <Table
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table} scroll={{ x: 1000 }}
                        bordered
                        pagination={{ total: totalItems }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRowClick={async event => { }}
                    />
                </div>
            </Fragment>
        )
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListMajors: (pageIndex, pageSize) => dispatch({ type: REDUX_SAGA.MAJORS.GET_MAJORS, pageIndex, pageSize })
});

const mapStateToProps = (state, ownProps) => ({
    list_majors: state.Majors.items,
    list_branches: state.Branches.items,
    totalItems: state.Majors.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListMajors)