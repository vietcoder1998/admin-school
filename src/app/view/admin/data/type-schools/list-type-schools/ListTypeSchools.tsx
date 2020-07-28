import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Row, Col } from 'antd';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { ITypeSchool } from '../../../../../../models/type-schools';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { PUT, DELETE } from '../../../../../../const/method';
import { TYPE_SCHOOLS } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../const/type';
import { routeLink, routePath } from '../../../../../../const/break-cumb';

interface ListTypeSchoolsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListTypeSchools: Function;
}

interface ListTypeSchoolsState {
    list_type_schools: Array<ITypeSchool>;
    loadingTable: boolean;
    dataTable: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
    priority?: number;
}

class ListTypeSchools extends PureComponent<ListTypeSchoolsProps, ListTypeSchoolsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_type_schools: [],
            loadingTable: true,
            dataTable: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            name: "",
            id: "",
            type: TYPE.EDIT,
            priority: null,
        }
    }

    async componentDidMount() {
        await this.props.getListTypeSchools(0, 10);
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.list_type_schools !== prevState.list_type_schools) {
            let dataTable: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_type_schools.forEach((item: any, index: number) => {
                dataTable.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    priority: item.priority,
                });
            });

            return {
                list_type_schools: nextProps.list_type_schools,
                dataTable,
                loadingTable: false
            }
        }
        return { loadingTable: false };
    }


    EditContent = (
        <>
            <Icon
                className="test" key="edit" style={{ padding: 5, margin: 2 }}
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
            fixed: 'left',
            className: 'action',
        },
        {
            title: 'Tên loại trường',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 100,
            fixed: 'right',
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        this.props.getListTypeSchools(event.current - 1, event.pageSize)
    };

    editTypeSchools = async () => {
        let { name, id, priority } = this.state;
        if (name) {
            await _requestToServer(
                PUT, TYPE_SCHOOLS + `/${id}`,
                {
                    name: name.trim(),
                    priority: priority
                }
            ).then((res: any) => {
                this.props.getListTypeSchools();
                this.toggleModal();
            })
        }
    };

    removeTypeSchools = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, TYPE_SCHOOLS,
            [id]
        ).then((res: any) => {
            if (res) {
                this.props.getListTypeSchools();
                this.toggleModal();
            }
        })
    };

    render() {
        let { dataTable, loadingTable, openModal, name, type } = this.state;
        let { totalItems } = this.props;
        return (
            <>
                <ModalConfig
                    title={type === TYPE.EDIT ? "Sửa loại trường" : "Xóa loại trường"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => {
                        this.setState({ openModal: !openModal })
                    }}
                    handleOk={async () => type === TYPE.EDIT ? this.editTypeSchools() : this.removeTypeSchools()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên loại trường"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tên loại trường"
                            onChange={(event: any) => this.setState({ name: event })}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóa loại trường: {name}</div>
                    }
                </ModalConfig>
                <div>

                    <Row>
                        <Col md={2} lg={5} xl={6} xxl={8} />
                        <Col md={20} lg={14} xl={12} xxl={8}>
                            <h5>
                                Danh sách loại trường
                                <Button
                                    onClick={() => {
                                    }}
                                    type="primary"
                                    style={{
                                        float: "right",
                                    }}
                                >
                                    <Link to={routeLink.TYPE_SCHOOLS + routePath.CREATE}>
                                        <Icon type="plus" />
                                Thêm mới
                            </Link>
                                </Button>
                            </h5>
                            <Table
                                // @ts-ignore
                                columns={this.columns}
                                loading={loadingTable}
                                dataSource={dataTable}
                                locale={{ emptyText: 'Không có dữ liệu' }}
                                scroll={{ x: 350 }}
                                bordered
                                pagination={{ total: totalItems, showSizeChanger: true }}
                                size="middle"
                                onChange={this.setPageIndex}
                                onRow={(event) => ({ onClick: () => this.setState({ id: event.key, name: event.name, priority: event.priority }) })}
                            />
                        </Col>
                        <Col md={2} lg={5} xl={6} xxl={8} />
                    </Row>
                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListTypeSchools: (pageIndex: number, pageSize: number) => dispatch({
        type: REDUX_SAGA.TYPE_SCHOOLS.GET_TYPE_SCHOOLS,
        pageIndex,
        pageSize
    })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_type_schools: state.TypeSchools.items,
    totalItems: state.TypeSchools.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListTypeSchools)