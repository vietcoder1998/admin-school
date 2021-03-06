import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Select, Popconfirm, Tooltip, InputNumber, Row, Col, Input } from 'antd';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { Link } from 'react-router-dom';
import { ModalConfig } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { PUT, DELETE } from '../../../../../../const/method';
import { ANNOU_TYPES } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../const/type';
import { IAnnouType } from '../../../../../../models/annou-types';
import { IptLetterP } from '../../../../layout/common/Common';
import { routePath, routeLink } from '../../../../../../const/break-cumb';
const { Option } = Select;

interface IListAnnouTypesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListAnnouTypes: Function;
}

interface IListAnnouTypesState {
    list_annou_types: Array<IAnnouType>,
    loadingTable: boolean;
    dataTable: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
    targets?: Array<any>;
    target?: string;
    priority?: number;
    search?: string;
}

class ListAnnouTypes extends PureComponent<IListAnnouTypesProps, IListAnnouTypesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_annou_types: [],
            loadingTable: true,
            dataTable: [],
            pageIndex: 0,
            openModal: false,
            name: undefined,
            id: undefined,
            type: TYPE.EDIT,
            pageSize: 10,
            targets: [TYPE.ALL],
            target: null,
            priority: 0,
            search: undefined
        }
    };

    async componentDidMount() {
        await this.props.getListAnnouTypes(0, 10);
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
            width: 350,
            className: 'action',

        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            width: 90,
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

    static getDerivedStateFromProps(nextProps: IListAnnouTypesProps, prevState: IListAnnouTypesState) {
        if (nextProps.list_annou_types !== prevState.list_annou_types) {
            let dataTable: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_annou_types.forEach((item: IAnnouType, index: number) => {
                dataTable.push({
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
                dataTable,
                loadingTable: false
            }
        }
        return { loadingTable: false };
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
            <Tooltip placement="top" title={"Sửa bài đăng"}>
                <Icon
                    className='test'
                    type="edit"
                    theme="twoTone"
                    style={{ padding: 5, margin: 2 }}
                    onClick={() => this.toggleModal(TYPE.EDIT)}
                />
            </Tooltip>
            <Popconfirm
                title="Bạn chắc chắn chứ？"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okText="Xóa"
                cancelText="Hủy"
                okType={"danger"}
                onConfirm={() => this.removeAnnouTypes()}
            >
                <Icon
                    className='test'
                    type="delete"
                    theme="twoTone"
                    twoToneColor="red"
                    style={{ padding: 5, margin: 2 }}
                />
            </Popconfirm>
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
        let { target } = this.state;
        await this.setState({ pageIndex: event.current - 1, loadingTable: true, pageSize: event.pageSize });
        await this.props.getListAnnouTypes(event.current - 1, event.pageSize, target)
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
        let { dataTable, loadingTable, openModal, name, type, target, priority, targets, search, pageIndex, pageSize } = this.state;
        let { totalItems } = this.props;
        return (
            <>
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
                        title="Tên nhóm bài viết"
                        type={TYPE.INPUT}
                        value={name}
                        placeholder="Tên nhóm bài viết"
                        onChange={(event: any) => this.setState({ name: event })}
                        widthInput='100%'
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
                        style={{ padding: "10px 30px" }}
                    >
                        <InputNumber
                            min={-10000000}
                            max={1000000}
                            defaultValue={0}
                            value={priority}
                            style={{ width: '100%' }}
                            onChange={
                                (priority: number) => this.setState({ priority })
                            }
                        />
                    </InputTitle>
                </ModalConfig>
                <Row>
                    <Col md={0} lg={0} xl={0} xxl={2} />
                    <Col md={24} lg={24} xl={24} xxl={20}>
                        <h5>
                            Danh sách nhóm bài viết ({totalItems})
                                <Button
                                onClick={() => {
                                }}
                                type="primary"
                                style={{
                                    float: "right",
                                }}
                            >
                                <Link to={routeLink.ANNOU_TYPE + routePath.CREATE}>
                                    <Icon type="plus" />
                                Thêm mới
                                </Link>
                            </Button>
                        </h5>
                        <Row>
                            <Col xs={24} sm={8} md={8} lg={8} xl={8} xxl={8} >
                                <IptLetterP value={"Loại bài viết"} />
                                <Select
                                    showSearch
                                    placeholder="Tất cả"
                                    defaultValue="Tất cả"
                                    optionFilterProp="children"
                                    style={{ width: "100%" }}
                                    value={target}
                                    onChange={(event: any) => {
                                        this.setState({ target: event });
                                    }}
                                >
                                    <Option value={null}>Tất cả</Option>
                                    <Option value={TYPE.EMPLOYER}>Nhà trường</Option>
                                    <Option value={TYPE.SCHOOL}>Nhà tuyển dụng</Option>
                                    <Option value={TYPE.CANDIDATE}>Ứng viên</Option>
                                    <Option value={TYPE.PUBLIC}>Khách</Option>
                                    <Option value={TYPE.STUDENT}>Học sinh</Option>
                                </Select>
                            </Col>
                            <Col sm={12} md={12} lg={8} xl={8} xxl={8}>
                                <IptLetterP value={"Lọc"} />
                                <Input
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    value={search}
                                    onChange={(event: any) => this.setState({ search: event.target.value })}
                                    onPressEnter={(event: any) => this.props.getListAnnouTypes(pageIndex, pageSize, search)}
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
                            scroll={{ x: 850 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(event) => ({
                                onClick: () => this.setState({ id: event.key, name: event.name, targets: event.targets, priority: event.priority }),
                            })}
                        />
                    </Col>
                    <Col md={0} lg={0} xl={0} xxl={2} />
                </Row>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListAnnouTypes: (pageIndex: number, pageSize: number, target?: string) =>
        dispatch({ type: REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES, pageIndex, pageSize, target })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_annou_types: state.AnnouTypes.items,
    totalItems: state.AnnouTypes.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListAnnouTypes)