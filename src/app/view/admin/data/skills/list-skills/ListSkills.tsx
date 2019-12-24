import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Icon, Table, Button} from 'antd';
import {REDUX_SAGA} from '../../../../../../const/actions';
import {ISkills} from '../../../../../../redux/models/skills';
import {Link} from 'react-router-dom';
import {ModalConfig} from '../../../../layout/modal-config/ModalConfig';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {PUT, DELETE} from '../../../../../../const/method';
import {SKILLS} from '../../../../../../services/api/private.api';
import {TYPE} from '../../../../../../const/type';

interface ListSkillsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListSkills: Function;
}

interface ListSkillsState {
    list_skills: Array<ISkills>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    pageSize: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
}

class ListSkills extends PureComponent<ListSkillsProps, ListSkillsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            list_skills: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            pageSize: 10,
            openModal: false,
            name: undefined,
            id: undefined,
            type: TYPE.EDIT,
        }
    }

    async componentDidMount() {
        await this.props.getListSkills(0, 10);
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.list_skills !== prevState.list_skills) {
            let data_table: any = [];
            let {pageIndex, pageSize} = prevState;
            nextProps.list_skills.forEach((item: any, index: any) => {
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
                className="test"                 key="edit"                 style={{ padding: 5 , margin: 2}}
                type="edit"
                theme="twoTone"
                onClick={
                    () => this.toggleModal(TYPE.EDIT)
                }
            />
            <Icon
                className="test"
                style={{ padding: 5 , margin: 2}}
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
        let {openModal} = this.state;
        this.setState({openModal: !openModal});
        if (type) {
            this.setState({type})
        }
    };

    columns = [
        {
            title: '#',
            width: 60,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Tên kỹ năng',
            dataIndex: 'name',
            key: 'name',
            width: 640,
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

    setPageIndex = async (event: any) => {
        await this.setState({pageIndex: event.current - 1, loading_table: true, pageSize: event.pageSize});
        this.props.getListSkills(event.current - 1, event.pageSize)
    };

    editSkills = async () => {
        let {name, id} = this.state;
        if (name) {
            await _requestToServer(
                PUT, SKILLS + `/${id}`,
                {
                    name: name.trim()
                },
            ).then((res: any) => {
                if (res && res.code === 200) {
                    this.props.getListSkills();
                    this.toggleModal();
                }
            })
        }
    };

    removeSkills = async () => {
        let {id} = this.state;
        await _requestToServer(
            DELETE, SKILLS,
            [id]
        ).then(res => {
            this.props.getListSkills();
            this.toggleModal();
        })
    };


    render() {
        let {data_table, loading_table, openModal, name, type} = this.state;
        let {totalItems} = this.props;
        return (
            <Fragment>
                <ModalConfig
                    title={type === TYPE.EDIT ? "Sửa kỹ năng" : "Xóa kỹ năng"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => {
                        this.setState({openModal: !openModal})
                    }}
                    handleOk={async () => type === TYPE.EDIT ? this.editSkills() : this.removeSkills()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên tỉnh"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tên tỉnh"
                            onChange={(event: any) => this.setState({name: event})}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóa kỹ năng: {name}</div>
                    }
                </ModalConfig>
                <div>
                    <h5>
                        Danh sách kỹ năng
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
                                Thêm kỹ năng mới
                            </Link>
                        </Button>
                    </h5>
                    <Table
                        // @ts-ignore
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table}
                        scroll={{x: 800}}
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
    getListSkills: (pageIndex: number, pageSize: number) => dispatch({type: REDUX_SAGA.SKILLS.GET_SKILLS, pageIndex, pageSize})
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_skills: state.Skills.items,
    totalItems: state.Skills.totalItems
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListSkills)