import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button, Row, Col, Popover } from 'antd';
import { REDUX_SAGA } from '../../../../../../const/actions';
import { ILanguages } from '../../../../../../redux/models/languages';
import { _requestToServer } from '../../../../../../services/exec';
import { POST, PUT, DELETE } from '../../../../../../const/method';
import { LANGUAGES } from '../../../../../../services/api/private.api';
import { TYPE } from '../../../../../../const/type';
import { AppModal } from "../../../../layout/modal-config/AppModal";
import { InputTitle } from "../../../../layout/input-tittle/InputTitle";

interface ListLanguagesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListLanguages: Function;
}

interface ListLanguagesState {
    list_skills: Array<ILanguages>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
}

class ListLanguages extends PureComponent<ListLanguagesProps, ListLanguagesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_skills: [],
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
        await this.props.getListLanguages(0, 10);
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.list_skills !== prevState.list_skills) {
            let data_table: any = [];
            let { pageIndex, pageSize } = prevState;
            nextProps.list_skills.forEach((item: any, index: number) => {
                data_table.push({
                    key: item.id,
                    index: (index + (pageIndex ? pageIndex : 0) * (pageSize ? pageSize : 10) + 1),
                    name: item.name,
                });
            });

            return {
                list_skills: nextProps.list_skills,
                data_table,
                loading_table: false
            }
        }
        return { loading_table: false };
    }

    EditContent = (
        <>
            <Icon
                className="test"
                key="edit"
                style={{ padding: 5, margin: 2 }}
                type="edit"
                theme="twoTone"
                onClick={() => this.toggleModal(true, TYPE.EDIT)}
            />
            <Icon
                className="test"
                style={{ padding: 5, margin: 2 }}
                type="delete"
                theme="twoTone"
                twoToneColor="red"
                onClick={() => this.toggleModal(true, TYPE.DELETE)}
            />
        </>
    );

    columns = [
        {
            title: 'STT',
            width: 50,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Tên ngôn ngữ',
            dataIndex: 'name',
            key: 'name',
            className: 'action',
            width: 300,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 100,
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event: any) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize });
        this.props.getListLanguages(event.current - 1, event.pageSize)
    };

    addLanguage = async () => {
        let { name } = this.state;
        if (name) {
            await _requestToServer(
                POST, LANGUAGES,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListLanguages();
            })
        }
    };

    editLanguage = async () => {
        let { name, id } = this.state;
        if (name) {
            await _requestToServer(
                PUT, LANGUAGES + `/${id}`,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListLanguages();
            })
        }
    };

    removeLanguages = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE, LANGUAGES,
            [id]
        ).then((res: any) => {
            this.props.getListLanguages();
        })
    };

    getModalTitle = () => {
        let { type } = this.state;
        if (type) {
            switch (type) {
                case TYPE.CREATE:
                    return "Thêm ngôn ngữ";
                case TYPE.EDIT:
                    return "Cập nhật ngôn ngữ";
            }
        }
    };

    toggleModal = (visible: boolean, type?: string) => {
        let { openModal } = this.state;
        this.setState({
            openModal: !openModal,
            type
        });
    };

    render() {
        let { data_table, loading_table, openModal, name, type } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment>
                <AppModal
                    title={this.getModalTitle()}
                    visible={openModal}
                    changeVisible={(visible: boolean) => {
                        this.toggleModal(visible);
                    }}
                    width={500}
                    onOk={() => {
                        if (type === TYPE.CREATE) {
                            this.addLanguage();
                        } else if (type === TYPE.EDIT) {
                            this.editLanguage();
                        }
                    }}
                    onCancel={() => {

                    }}
                >
                    <InputTitle
                        title="Tên ngôn ngữ*"
                        type={TYPE.INPUT}
                        value={name}
                        placeholder="Tên ngôn ngữ"
                        onChange={(event: any) => this.setState({ name: event })}
                        widthInput="500px" />
                </AppModal>
                <div>
                    <Row gutter={10}>
                        <Col span={6} />
                        <Col span={10}>
                            <h4>Danh sách ngôn ngữ</h4>
                        </Col>
                        <Col span={1}>
                            <Popover content="Xóa đã chọn" trigger="hover">
                                <Button
                                    onClick={() => {
                                    }}
                                    shape="circle"
                                    type="danger"
                                    icon="delete"
                                >
                                </Button>
                            </Popover>
                        </Col>
                        <Col span={1}>
                            <Popover content="Thêm mới" trigger="hover">
                                <Button
                                    onClick={() => this.toggleModal(true, TYPE.CREATE)}
                                    shape="circle"
                                    type="primary"
                                    icon="plus"
                                >
                                    {/*<Link to='/admin/data/skills/create'/>*/}
                                </Button>
                            </Popover>
                        </Col>
                        <Col span={6} />
                    </Row>
                    <Row>
                        <Col span={6} />
                        <Col span={12}>
                            <Table
                                // @ts-ignore
                                columns={this.columns}
                                loading={loading_table}
                                dataSource={data_table}
                                useFixedHeader={true}
                                scroll={{ y: 500 }}
                                bordered
                                pagination={{ total: totalItems, showSizeChanger: true }}
                                size="middle"
                                onChange={this.setPageIndex}
                                onRow={(event) => ({ onClick: () => this.setState({ id: event.key, name: event.name }) })}
                            />
                        </Col>
                        <Col span={6} />
                    </Row>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getListLanguages: (pageIndex: number, pageSize: number) => dispatch({
        type: REDUX_SAGA.LANGUAGES.GET_LANGUAGES,
        pageIndex,
        pageSize
    })
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_skills: state.Languages.items,
    totalItems: state.Languages.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListLanguages)