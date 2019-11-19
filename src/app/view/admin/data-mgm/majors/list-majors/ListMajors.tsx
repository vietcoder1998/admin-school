import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Icon, Table, Button} from 'antd';
import {REDUX_SAGA} from '../../../../../../common/const/actions';
import {IMajor} from '../../../../../../redux/models/majors';
import {Link} from 'react-router-dom';
import {IBranches} from '../../../../../../redux/models/branches';
import {MAJORS} from '../../../../../../services/api/private.api';
import {DELETE, PUT, GET} from '../../../../../../common/const/method';
import {_requestToServer} from '../../../../../../services/exec';
import {ModalConfig} from '../../../../layout/modal-config/ModalConfig';
import {TYPE} from '../../../../../../common/const/type';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';

interface ListMajorsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListMajors: Function;
}

interface ListMajorsState {
    list_majors: Array<IMajor>,
    list_branch?: Array<IBranches>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    name?: string;
    id?: string;
    branchName?: string;
    branchID?: number;
    type: string;
    openModal: boolean;
    list_data: Array<{ label: string, value: number }>;
}

class ListMajors extends PureComponent<ListMajorsProps, ListMajorsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_majors: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            list_branch: [],
            id: undefined,
            branchName: undefined,
            branchID: undefined,
            type: TYPE.EDIT,
            openModal: false,
            list_data: []
        };
    };

    async componentDidMount() {
        await this.props.getListMajors(0, 10);
    };

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_majors !== prevState.list_majors) {
            let data_table: any = [];
            let {pageIndex, pageSize} = prevState;
            nextProps.list_majors.forEach((item: any, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    branchName: item.branch ? item.branch.name : "Khác"
                });
            });

            return {
                list_majors: nextProps.list_majors,
                data_table,
                loading_table: false,
            }
        }

        if (nextProps.list_branches !== prevState.list_branches) {
            let list_data: any = [];
            nextProps.list_branches.forEach((item: any) => list_data.push({value: item.id, label: item.name}));
            return {
                list_branches: nextProps.list_branches,
                list_data,
            }
        }

        return null;
    };


    EditContent = (
        <div>
            <Icon key="delete" style={{padding: "5px 10px"}} type="delete" theme="twoTone" twoToneColor="red"
                  onClick={() => this.toggleModal(TYPE.DELETE)}/>
            <Icon key="edit" style={{padding: "5px 10px"}} type="edit" theme="twoTone"
                  onClick={() => this.toggleModal(TYPE.EDIT)}/>
        </div>
    );

    toggleModal = (type?: string) => {
        let {openModal} = this.state;
        if (type) {
            this.setState({type})
        }
        this.setState({openModal: !openModal})
    };

    choseMajor = async (event: any) => {
        await this.setState({id: event.key, name: event.name, branchName: event.branchName});
        await this.getMajorDetail(event.key)
    };

    getMajorDetail = async (id: number) => {
        await _requestToServer(
            GET, MAJORS + `/${id}`,
            undefined,
            undefined, undefined, undefined, false, false
        ).then((res: any) => {
            if (res) {
                this.setState({branchID: res.data.branch.id})
            }
        })
    };

    handleChoseMajor = (id: number) => {
        let {list_data} = this.state;
        list_data.forEach(item => {
            if (item.value === id) {
                this.setState({branchName: item.label})
            }
        });
        this.setState({branchID: id})
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
            width: 200,
            fixed: "right",
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize});
        this.props.getListMajors(event.current - 1, event.pageSize)
    };

    editMajor = async () => {
        let {name, id, branchID} = this.state;
        if (name) {
            await _requestToServer(
                PUT, MAJORS + `/${id}`,
                {
                    name: name.trim(),
                    branchID
                }
            ).then((res: any) => {
                this.props.getListMajors(0);
                this.toggleModal();
            })
        }
    };

    removeMajor = async () => {
        let {id} = this.state;
        await _requestToServer(
            DELETE, MAJORS,
            [id]
        ).then((res: any) => {
            this.props.getListMajors(0);
            this.toggleModal();
        })
    };

    render() {
        let {data_table, loading_table, type, openModal, list_data, name, branchName} = this.state;
        let {totalItems} = this.props;
        return (
            <Fragment>
                <div>
                    <h5>
                        Danh sách chuyên ngành
                        <Button
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            <Link to='/admin/data/majors/create'>
                                <Icon type="plus"/>
                                Thêm chuyên ngành mới
                            </Link>
                        </Button>
                    </h5>
                    <ModalConfig
                        namebtn1={"Hủy"}
                        namebtn2={"Hoàn thành"}
                        title="Thay đổi chuyên ngành"
                        isOpen={openModal}
                        handleOk={() => type === TYPE.EDIT ? this.editMajor() : this.removeMajor()}
                        toggleModal={this.toggleModal}
                    >
                        {type === TYPE.EDIT ? (
                            <Fragment>
                                <InputTitle
                                    type={TYPE.INPUT}
                                    title="Sửa tên ngành "
                                    widthLabel="120px"
                                    placeholder="Thay đổi tên"
                                    value={name}
                                    widthInput={"250px"}
                                    style={{padding: "0px 20px"}}
                                    onChange={(event: any) => this.setState({name: event})}
                                />
                                <InputTitle
                                    type={TYPE.SELECT}
                                    title="Chọn chuyên ngành "
                                    placeholder="Chọn chuyên ngành "
                                    value={branchName}
                                    list_value={list_data}
                                    style={{padding: "0px 20px"}}
                                    onChange={this.handleChoseMajor}
                                />
                            </Fragment>
                        ) : <div>Bạn chắc chắn muốn xóa chuyên ngành này: {name}</div>}
                    </ModalConfig>
                    <Table
                        // @ts-ignore
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table}
                        scroll={{x: 1000}}
                        bordered
                        pagination={{total: totalItems, showSizeChanger: true}}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRow={(event) => ({onClick: () => this.choseMajor(event)})}
                    />
                </div>
            </Fragment>
        )
    };
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListMajors: (pageIndex: number, pageSize: number) => dispatch({
        type: REDUX_SAGA.MAJORS.GET_MAJORS,
        pageIndex,
        pageSize
    })
});

const mapStateToProps = (state: any, ownProps: any) => ({
    list_majors: state.Majors.items,
    list_branches: state.Branches.items,
    totalItems: state.Majors.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListMajors)