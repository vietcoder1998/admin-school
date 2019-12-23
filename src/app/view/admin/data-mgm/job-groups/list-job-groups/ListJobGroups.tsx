import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Icon, Table, Button} from 'antd';
import {REDUX_SAGA} from '../../../../../../const/actions';
import {IJobGroup} from '../../../../../../redux/models/job-groups';
import {Link} from 'react-router-dom';
import {ModalConfig} from '../../../../layout/modal-config/ModalConfig';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {PUT, DELETE} from '../../../../../../const/method';
import {JOB_GROUPS} from '../../../../../../services/api/private.api';
import {TYPE} from '../../../../../../const/type';

interface ListJobGroupsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobGroups: Function;
}

interface ListJobGroupsState {
    list_job_groups: Array<IJobGroup>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
}

class ListJobGroups extends PureComponent<ListJobGroupsProps, ListJobGroupsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_job_groups: [],
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
        await this.props.getListJobGroups(0, 10);
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_job_groups !== prevState.list_job_groups) {
            let data_table: any = [];
            let {pageIndex, pageSize} = prevState;
            nextProps.list_job_groups.forEach((item: any, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                });
            });

            return {
                list_job_groups: nextProps.list_job_groups,
                data_table,
                loading_table: false
            }
        }
        return { loading_table: false };
    }


    EditContent = (
        <div>
            <Icon style={{padding: "5px 10px"}} type="delete" theme="twoTone" twoToneColor="red"
                  onClick={() => this.toggleModal(TYPE.DELETE)}/>
            <Icon key="edit" style={{padding: "5px 10px"}} type="edit" theme="twoTone"
                  onClick={() => this.toggleModal(TYPE.EDIT)}/>
        </div>
    );

    toggleModal = (type?: string) => {
        let {openModal} = this.state;
        this.setState({openModal: !openModal});
        if (type) {
            this.setState({type})
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
            title: 'Tên nhóm công việc',
            dataIndex: 'name',
            key: 'name',
            width: 755,
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

    setPageIndex = async (event: any) => {
        await this.setState({pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize});
        this.props.getListJobGroups(event.current - 1, event.pageSize)
    };

    editJobGroups = async () => {
        let {name, id} = this.state;
        if (name) {
            await _requestToServer(
                PUT, JOB_GROUPS + `/${id}`,
                {name}
            ).then((res: any) => {
                this.props.getListJobGroups();
                this.toggleModal();
            })
        }
    };

    removeJobGroups = async () => {
        let {id} = this.state;
        await _requestToServer(
            DELETE, JOB_GROUPS,
            [id]
        ).then((res: any) => {
            this.props.getListJobGroups();
            this.toggleModal();
        })
    };

    render() {
        let {data_table, loading_table, openModal, name, type} = this.state;
        let {totalItems} = this.props;
        return (
            <Fragment>
                <ModalConfig
                    title={type === TYPE.EDIT ? "Sửa nhóm công việc" : "Xóa nhóm công việc"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => {
                        this.setState({openModal: !openModal})
                    }}
                    handleOk={async () => type === TYPE.EDIT ? this.editJobGroups() : this.removeJobGroups()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên nhóm công việc"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tên nhóm công việc"
                            onChange={(event: any) => this.setState({name: event})}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóa nhóm công việc : {name}</div>
                    }
                </ModalConfig>
                <div>
                    <h5>
                        Danh sách nhóm công việc
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to='/admin/data/job-groups/create'>
                                <Icon type="plus"/>
                                Thêm nhóm công việc mới
                            </Link>
                        </Button>
                    </h5>
                  
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
                        onRow={(event) => ({onClick: () => this.setState({id: event.key, name: event.name})})}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListJobGroups: (pageIndex: number, pageSize: number) => dispatch({
        type: REDUX_SAGA.JOB_GROUPS.GET_JOB_GROUPS,
        pageIndex,
        pageSize
    })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_job_groups: state.JobGroups.items,
    totalItems: state.JobGroups.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListJobGroups)