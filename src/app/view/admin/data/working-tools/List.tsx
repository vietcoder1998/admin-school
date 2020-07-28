import React, { PureComponent, } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Input, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import IWorkingTools, { IWorkingTool } from '../../../../../models/working-tools';
import { _requestToServer } from '../../../../../services/exec';
import { DELETE, PUT, GET } from '../../../../../const/method';
import { WORKING_TOOLS } from '../../../../../services/api/private.api';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { TYPE } from '../../../../../const/type';
import { ModalConfig } from '../../../layout/modal-config/ModalConfig';
import { REDUX_SAGA } from '../../../../../const/actions';
import { IAppState } from '../../../../../redux/store/reducer';
import { IptLetterP } from '../../../layout/common/Common';

interface IProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListWorkingTools: (pageIndex?: number, pageSize?: number, name?: string) => any;
    getListMajors: (pageIndex?: number, pageSize?: number, name?: string) => any;
}

interface IState {
    listWorkingTools: Array<IWorkingTools>,
    loadingTable: boolean;
    dataTale: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal?: boolean;
    jobGroupID?: number;
    id?: string;
    type?: string;
    name?: string;
    jobGroupName?: string;
    listData: Array<{ label: string, value: number }>;
    search?: string;
}

class ListWorkingTools extends PureComponent<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            listWorkingTools: [],
            loadingTable: true,
            dataTale: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            id: undefined,
            name: undefined,
            type: TYPE.EDIT,
            jobGroupID: undefined,
            jobGroupName: undefined,
            listData: [],
        }
    }

    async componentDidMount() {
        await this.props.getListWorkingTools(0, 10);
    }

    static getDerivedStateFromProps(nextProps?: IProps, prevState?: IState) {
        if (nextProps.listWorkingTools !== prevState.listWorkingTools) {
            let dataTale: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.listWorkingTools.forEach((item?: IWorkingTool, index?: any) => {
                dataTale.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                });
            });

            return {
                listWorkingTools: nextProps.listWorkingTools,
                dataTale,
                loadingTable: false
            }
        }

        return { loadingTable: false };
    }

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        if (type) {
            this.setState({ type })
        }
        this.setState({ openModal: !openModal })
    };

    EditContent: JSX.Element = (
        <>
            <Icon
                className='test'
                key="edit"
                style={{ padding: 5, margin: 2 }}
                type="edit"
                theme="twoTone"
                onClick={() => this.toggleModal(TYPE.EDIT)}
            />
            <Icon
                className='test'
                key="delete"
                style={{ padding: 5, margin: 2 }}
                type="delete"
                theme="twoTone"
                twoToneColor="red"
                onClick={() => this.toggleModal(TYPE.DELETE)}
            />
        </>
    );

    columns = [
        {
            title: '#',
            width: 50,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
            fixed: 'left',
        },
        {
            title: 'Tên công cụ',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            className: 'action',
            fixed: false,
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
        await this.props.getListWorkingTools(event.current - 1, event.pageSize);
    };

    choseWorkingTool = (event: any) => {
        this.setState({ id: event.key, name: event.name, jobGroupName: event.jobGroupName });
        this.getWorkingToolDetail(event.key);
    };

    getWorkingToolDetail = async (id: number) => {
        await _requestToServer(
            GET, WORKING_TOOLS + `/${id}`,
            undefined,
            undefined, undefined, undefined, false, false
        )
    };

    editWorkingTools = async () => {
        let { name, id } = this.state;
        if (name) {
            await _requestToServer(
                PUT, WORKING_TOOLS + `/${id}`,
                {
                    name: name.trim(),
                }
            ).then((res: any) => {
                this.props.getListWorkingTools(0);
                this.toggleModal();
            })
        }
    };

    removeWorkingTools = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, WORKING_TOOLS,
            [id]
        ).then((res: any) => {
            this.props.getListWorkingTools(0);
            this.toggleModal();
        })
    };

    render() {
        let {
            dataTale,
            loadingTable,
            openModal,
            type,
            name,
            pageIndex,
            pageSize,
            search,
        } = this.state;
        let { totalItems } = this.props;
        return (
            <>
                <ModalConfig
                    namebtn1={"Hủy"}
                    namebtn2={"Hoàn thành"}
                    title="Thay đổi công việc"
                    isOpen={openModal}
                    handleOk={() => type === TYPE.EDIT ? this.editWorkingTools() : this.removeWorkingTools()}
                    handleClose={this.toggleModal}
                    toggleModal={this.toggleModal}
                >
                    {type === TYPE.EDIT ? (
                        <>
                            <InputTitle
                                type={TYPE.INPUT}
                                title="Sửa tên công việc"
                                widthLabel="200px"
                                placeholder="Thay đổi tên"
                                value={name}
                                widthInput={"200px"}
                                style={{ padding: 10 }}
                                onChange={(event: any) => this.setState({ name: event })}
                            />
                        </>
                    ) : <div>Bạn chắc chắn muốn xóa loại công việc này: {name}</div>}
                </ModalConfig>
                <Row>
                    <Col md={0} lg={5} xl={6} xxl={4} />
                    <Col md={24} lg={14} xl={12} xxl={16} >
                        <h5>
                            Danh sách công cụ làm việc
                        <Button
                                onClick={() => {
                                }}
                                type="primary"
                                style={{
                                    float: "right",
                                }}
                            >
                                <Link to={'/admin/data/working-tools/create'}>
                                    <Icon type="plus" />
                                Thêm mới
                            </Link>
                            </Button>
                        </h5>
                        <Row>
                            <IptLetterP value={"Tên công cụ"} />
                            <Col sm={12} md={16} lg={16} xl={16} xxl={8}>
                                <Input
                                    placeholder="Tất cả"
                                    style={{ width: "100%" }}
                                    value={search}
                                    onChange={(event: any) => this.setState({ search: event.target.value })}
                                    onPressEnter={(event: any) => this.props.getListWorkingTools(pageIndex, pageSize, search)}
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
                            dataSource={dataTale}
                            scroll={{ x: 400 }}
                            bordered
                            pagination={{ total: totalItems, showSizeChanger: true }}
                            size="middle"
                            onChange={this.setPageIndex}
                            onRow={(event: any) => ({ onClick: () => this.choseWorkingTool(event) })}
                        />
                    </Col>

                    <Col md={2} lg={5} xl={6} xxl={4} />
                </Row>

            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListWorkingTools: (pageIndex: number, pageSize: number, name?: string) => dispatch({
        type: REDUX_SAGA.WORKING_TOOL.GET_WORKING_TOOLS, pageIndex, pageSize, name
    }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    listWorkingTools: state.WorkingTools.items,
    totalItems: state.WorkingTools.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListWorkingTools)