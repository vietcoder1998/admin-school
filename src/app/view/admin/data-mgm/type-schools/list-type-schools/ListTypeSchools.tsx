import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { ITypeSchool } from '../../../../../../redux/models/type-schools';
import { Link } from 'react-router-dom';
import { ConfigModal } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { PUT, DELETE } from '../../../../../../common/const/method';
import { TYPE_SCHOOLS } from '../../../../../../services/api/private.api';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { TYPE } from '../../../../../../common/const/type';

interface ListTypeSchoolsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListTypeSchools: Function;
}

interface ListTypeSchoolsState {
    list_type_schools: Array<ITypeSchool>;
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
}

class ListTypeSchools extends PureComponent<ListTypeSchoolsProps, ListTypeSchoolsState> {
    constructor(props) {
        super(props);
        this.state = {
            list_type_schools: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            name: "",
            id: "",
            type: TYPE.EDIT,
        }
    }

    async componentDidMount() {
        await this.props.getListTypeSchools(0, 10);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_type_schools !== prevState.list_type_schools) {
            let data_table = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_type_schools.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) *  (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                });
            })

            return {
                list_type_schools: nextProps.list_type_schools,
                data_table,
                loading_table: false
            }
        }
        return null;
    }


    EditContent = (
        <div>
            <Icon style={{ padding: "5px 10px" }} type="delete" theme="twoTone" twoToneColor="red" onClick={() => this.toggleModal(TYPE.DELETE)} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" theme="twoTone" onClick={() => this.toggleModal(TYPE.EDIT)} />
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
            title: 'Tên loại trường',
            dataIndex: 'name',
            key: 'name',
            width: 755,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 200,
            fixed: "right",
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        this.props.getListTypeSchools(event.current - 1, event.pageSize)
    }

    editTypeSchools = async () => {
        let { name, id } = this.state;
        name = name.trim();
        await _requestToServer(
            PUT,
            { name },
            TYPE_SCHOOLS + `/${id}`,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListTypeSchools();
                this.toggleModal();
            }
        })
    }

    removeTypeSchools = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE,
            [id],
            TYPE_SCHOOLS,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListTypeSchools();
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
                    title={type === TYPE.EDIT ? "Sửa loại trường" : "Xóa loại trường"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => { this.setState({ openModal: !openModal }) }}
                    handleOk={async () => type === TYPE.EDIT ? this.editTypeSchools() : this.removeTypeSchools()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên loại trường"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tên loại trường"
                            onChange={event => this.setState({ name: event })}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóa loại trường: {name}</div>
                    }
                </ConfigModal>
                <div>
                    <h5>
                        Danh sách loại trường
                        <Button
                            onClick={() => { }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to='/admin/data/type-schools/create'>
                                <Icon type="plus" />
                                Thêm loại trường mới
                            </Link>
                        </Button>
                    </h5>
                    <Table
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table}
                        scroll={{ x: 1000 }}
                        bordered
                        pagination={{ total: totalItems, showSizeChanger: true }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRow={(event) => ({ onClick: () => this.setState({ id: event.key, name: event.name }) })}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListTypeSchools: (pageIndex, pageSize) => dispatch({ type: REDUX_SAGA.TYPE_SCHOOLS.GET_TYPE_SCHOOLS, pageIndex, pageSize })
})

const mapStateToProps = (state, ownProps) => ({
    list_type_schools: state.TypeSchools.items,
    totalItems: state.TypeSchools.totalItems
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListTypeSchools)