import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { PUT, DELETE } from '../../../../../../common/const/method';
import { ANNOU_TYPES } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../common/const/type';
import { IAnnouType} from '../../../../../../redux/models/annou-types';

interface ListAnnouTypesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListAnnouTypes: Function;
}

interface ListAnnouTypesState {
    list_annou_types: Array<IAnnouType>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
}

class ListAnnouTypes extends PureComponent<ListAnnouTypesProps, ListAnnouTypesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_annou_types: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            openModal: false,
            name: undefined,
            id: undefined,
            type: TYPE.EDIT,
            pageSize: 10,
        }
    }

    async componentDidMount() {
        await this.props.getListAnnouTypes(0, 10);
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_annou_types !== prevState.list_annou_types) {
            let data_table: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_annou_types.forEach((item: any, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                });
            });

            return {
                list_annou_types: nextProps.list_annou_types,
                data_table,
                loading_table: false
            }
        }
        return null;
    }


    EditContent = (
        <div>
            <Icon style={{ padding: "5px 10px" }} type="delete" theme="twoTone" twoToneColor="red"
                onClick={() => this.toggleModal(TYPE.DELETE)} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" theme="twoTone"
                onClick={() => this.toggleModal(TYPE.EDIT)} />
        </div>
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
            width: 150,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Tên nhóm bài viết',
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

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        this.props.getListAnnouTypes(event.current - 1, event.pageSize)
    };

    editAnnouTypes = async () => {
        let { name, id } = this.state;
        if (name) {
            await _requestToServer(
                PUT, ANNOU_TYPES + `/${id}`,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListAnnouTypes();
                this.toggleModal();
            })
        }
    };

    removeAnnouTypes = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, ANNOU_TYPES,
            [id]
        ).then((res: any) => {
            this.props.getListAnnouTypes();
            this.toggleModal();
        })
    };

    render() {
        let { data_table, loading_table, openModal, name, type } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment>
                <ModalConfig
                    title={type === TYPE.EDIT ? "Sửa nhóm bài viết" : "Xóa nhóm bài viết"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => {
                        this.setState({ openModal: !openModal })
                    }}
                    handleOk={async () => type === TYPE.EDIT ? this.editAnnouTypes() : this.removeAnnouTypes()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên nhóm bài viết"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tên nhóm bài viết"
                            onChange={(event: any) => this.setState({ name: event })}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóa nhóm bài viết : {name}</div>
                    }
                </ModalConfig>
                <div>
                    <h5>
                        Danh sách nhóm bài viết
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            <Link to='/admin/data/annou-types/create'>
                                <Icon type="plus" />
                                Thêm nhóm bài viết mới
                            </Link>
                        </Button>
                    </h5>
                    <Table
                        // @ts-ignore
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

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListAnnouTypes: (pageIndex: number, pageSize: number) => dispatch({ type: REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES, pageIndex, pageSize })
});

const mapStateToProps = (state: any, ownProps: any) => ({
    list_annou_types: state.AnnouTypes.items,
    totalItems: state.AnnouTypes.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListAnnouTypes)