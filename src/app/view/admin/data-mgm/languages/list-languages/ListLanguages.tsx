import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Icon, Table, Button} from 'antd';
import {REDUX_SAGA} from '../../../../../../common/const/actions';
import {ILanguages} from '../../../../../../redux/models/languages';
import {Link} from 'react-router-dom';
import {ModalConfig} from '../../../../layout/modal-config/ModalConfig';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {PUT, DELETE} from '../../../../../../common/const/method';
import {LANGUAGES} from '../../../../../../services/api/private.api';
import {TYPE} from '../../../../../../common/const/type';

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

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.list_skills !== prevState.list_skills) {
            let data_table: any = [];
            let {pageIndex, pageSize} = prevState;
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
        return null;
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
            title: 'Tên ngôn ngữ',
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
        await this.setState({pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize});
        this.props.getListLanguages(event.current - 1, event.pageSize)
    };

    editLanguages = async () => {
        let {name, id} = this.state;
        if (name) {
            await _requestToServer(
                PUT, LANGUAGES + `/${id}`,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListLanguages();
                this.toggleModal();
            })
        }
    };

    removeLanguages = async () => {
        let {id} = this.state;
        await _requestToServer(
            DELETE, LANGUAGES,
            [id]
        ).then((res: any) => {
            this.props.getListLanguages();
            this.toggleModal();
        })
    };

    render() {
        let {data_table, loading_table, openModal, name, type} = this.state;
        let {totalItems} = this.props;
        return (
            <Fragment>
                <ModalConfig
                    title={type === TYPE.EDIT ? "Sửa ngôn ngữ" : "Xóa ngôn ngữ"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => {
                        this.setState({openModal: !openModal})
                    }}
                    handleOk={async () => type === TYPE.EDIT ? this.editLanguages() : this.removeLanguages()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên ngôn ngữ"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tên ngôn ngữ"
                            onChange={(event: any) => this.setState({name: event})}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóa ngôn ngữ: {name}</div>
                    }
                </ModalConfig>
                <div>
                    <h5>
                        Danh sách ngôn ngữ
                        <Button
                            onClick={() => {
                            }}
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to='/admin/data/skills/create'>
                                <Icon type="plus"/>
                                Thêm ngôn ngữ mới
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

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListLanguages: (pageIndex: number, pageSize: number) => dispatch({type: REDUX_SAGA.LANGUAGES.GET_LANGUAGES, pageIndex, pageSize})
});

const mapStateToProps = (state: any, ownProps: any) => ({
    list_skills: state.Languages.items,
    totalItems: state.Languages.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListLanguages)