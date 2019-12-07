import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Select, Popconfirm, Tooltip, InputNumber } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { PUT, DELETE } from '../../../../../../common/const/method';
import { ANNOU_TYPES } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../common/const/type';
import { IAnnouType } from '../../../../../../redux/models/annou-types';

interface IListAnnouTypesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListAnnouTypes: Function;
}

interface IListAnnouTypesState {
    list_annou_types: Array<IAnnouType>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
    targets?: Array<any>;
    priority?: number;
}

class ListAnnouTypes extends PureComponent<IListAnnouTypesProps, IListAnnouTypesState> {
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
            targets: [TYPE.ALL],
            priority: 0,
        }
    };

    async componentDidMount() {
        await this.props.getListAnnouTypes(0, 10);
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
            width: 250,
            className: 'action',

        },
        {
            title: 'Đối tượng',
            dataIndex: 'targets',
            key: 'targets',
            width: 400,
            className: 'action',

        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            width: 200,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 100,
            fixed: "right",
            render: () => this.EditContent,
        },
    ];

    static getDerivedStateFromProps(nextProps: IListAnnouTypesProps, prevState: IListAnnouTypesState) {
        if (nextProps.list_annou_types !== prevState.list_annou_types) {
            let data_table: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_annou_types.forEach((item: IAnnouType, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                    targets: item.targets.length > 0 ?
                        item.targets.map((element: string, index: number) => element + (index === item.targets.length - 1 ? '' : ',')) : TYPE.ALL,
                    priority: item.priority
                });
            });

            return {
                list_annou_types: nextProps.list_annou_types,
                data_table,
                loading_table: false
            }
        }
        return null;
    };


    list_option = () => {
        let list_type = [
            { id: 1, name: TYPE.CANDIDATE },
            { id: 2, name: TYPE.EMPLOYER },
            { id: 3, name: TYPE.SCHOOL },
            { id: 4, name: TYPE.PUBLIC },
            { id: 5, name: TYPE.STUDENT },
            { id: 5, name: TYPE.ALL },
        ];
        return list_type.map(
            (item: { id: number, name: string }, index: number) => (<Select.Option key={item.id + index} value={item.name}> {item.name}</Select.Option>)
        );
    };

    setTypeAnnou = (event?: Array<string>) => {
        let targets = []
        event && event.forEach((item: string) => {
            if (item !== TYPE.ALL) {
                if (item && item.includes(",")) {
                    let newItem = item.split(",");
                    item = newItem[0];
                }

                targets.push(item)
            }
        });

        return targets;
    }

    handleSampleValue = (event: any) => {
        if (event && event.length !== 0 && event[1] !== TYPE.ALL && event.length !== 5) {
            let targets = this.setTypeAnnou(event);
            return this.setState({ targets })
        } else {
            return this.setState({ targets: [TYPE.ALL] })
        }
    }

    EditContent = (
        <>
            <Popconfirm
                title="Bạn chắc chắn chứ？"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => this.removeAnnouTypes()}
            >
                <Icon type="delete" theme="twoTone" twoToneColor="red" style={{ padding: "5px 10px" }} />
            </Popconfirm>
            <Tooltip placement="top" title={"Sửa bài đăng"}>
                <Icon type="edit" theme="twoTone" style={{ padding: "5px 10px" }} onClick={() => this.toggleModal(TYPE.EDIT)} />
            </Tooltip>

        </>
    );

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        this.setState({ openModal: !openModal });
        if (type) {
            this.setState({ type })
        }
    };

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        this.props.getListAnnouTypes(event.current - 1, event.pageSize)
    };

    editAnnouTypes = async () => {
        let { name, id, targets, priority } = this.state;

        if (typeof targets === "string" || targets === [TYPE.ALL]) {
            targets = [TYPE.CANDIDATE, TYPE.EMPLOYER, TYPE.SCHOOL, TYPE.PUBLIC, TYPE.STUDENT]
        }

        targets = this.setTypeAnnou(targets);

        if (name) {
            await _requestToServer(
                PUT, ANNOU_TYPES + `/${id}`,
                {
                    name: name.trim(),
                    targets,
                    priority
                }
            ).then((res: any) => {
                this.props.getListAnnouTypes();
                this.toggleModal();
            });
        };
    };

    removeAnnouTypes = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, ANNOU_TYPES,
            [id]
        ).then((res: any) => {
            this.props.getListAnnouTypes();
        });
    };

    render() {
        let { data_table, loading_table, openModal, name, type, targets, priority } = this.state;
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
                    handleOk={async () => this.editAnnouTypes()}
                    handleClose={async () => this.toggleModal()}
                >

                    <InputTitle
                        title="Sửa tên nhóm bài viết"
                        type={TYPE.INPUT}
                        value={name}
                        placeholder="Tên nhóm bài viết"
                        onChange={(event: any) => this.setState({ name: event })}
                        widthInput="250px"
                    />
                    <InputTitle
                        title="Chọn tên công việc"
                    >
                        <Select
                            mode="multiple"
                            size="default"
                            placeholder="Nhập loại đối tượng"
                            value={targets}
                            style={{ width: '100%', margin: "10px 0px" }}
                            onSearch={(event: any) => { }}
                            onChange={(event: any) => this.handleSampleValue(event)}
                        >
                            {this.list_option()}
                        </Select>
                    </InputTitle>
                    <InputTitle
                        title="Chọn độ ưu tiên"
                        widthLabel="100px"
                        style={{ padding: "10px 30px" }}
                    >
                        <InputNumber
                            min={-10000000}
                            max={1000000}
                            defaultValue={0}
                            value={priority}
                            onChange={
                                (priority: number) => this.setState({ priority })
                            }
                        />
                    </InputTitle>
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
                        onRow={(event) => ({
                            onClick: () => this.setState({ id: event.key, name: event.name, targets: event.targets, priority: event.priority }),
                        })}
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