import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { ISkills } from '../../../../../../redux/models/skills';
import { Link } from 'react-router-dom';
import { ConfigModal } from '../../../../layout/modal-config/ModalConfig';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { PUT, DELETE } from '../../../../../../common/const/method';
import { SKILLS } from '../../../../../../services/api/private.api';
import { ADMIN_HOST } from '../../../../../../environment/dev';
import { TYPE } from '../../../../../../common/const/type';

interface ListSkillsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListSkills: Function;
}

interface ListSkillsState {
    list_skills: Array<ISkills>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
    openModal: boolean;
    name?: string;
    id?: string;
    type?: string;
}

class ListSkills extends PureComponent<ListSkillsProps, ListSkillsState> {
    constructor(props) {
        super(props);
        this.state = {
            list_skills: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
            openModal: false,
            name: "",
            id: "",
            type: TYPE.EDIT,
        }
    }

    async componentDidMount() {
        await this.props.getListSkills(0, 10);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_skills !== prevState.list_skills) {
            let data_table = [];
            let { pageIndex } = prevState;
            nextProps.list_skills.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    name: item.name,
                });
            })

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
            <Icon style={{ padding: "5px 10px" }} type="delete" onClick={() => this.toggleModal(TYPE.DELETE)} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" onClick={() => this.toggleModal(TYPE.EDIT)} />
        </div>
    )

    toggleModal = (type?: string) => {
        let { openModal } = this.state;
        this.setState({ openModal: !openModal });
        if (type) {
            this.setState({ type })
        }
    }

    columns = [
        {
            title: '#',
            width: 150,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Tên kỹ năng',
            dataIndex: 'name',
            key: 'name',
            width: 700,
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

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true });
        this.props.getListSkills(event.current - 1)
    }

    editSkills = async () => {
        let { name, id } = this.state;
        name = name.trim();
        await _requestToServer(
            PUT,
            { name },
            SKILLS + `/${id}`,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListSkills();
                this.toggleModal();
            }
        })
    }

    removeSkills = async () => {
        let { id } = this.state;
        await _requestToServer(
            DELETE,
            [id],
            SKILLS ,
            ADMIN_HOST,
            null,
            null,
            true
        ).then(res => {
            if (res && res.code === 200) {
                this.props.getListSkills();
                this.toggleModal();
            }
        })
    }


    render() {
        let { data_table, loading_table, openModal, name, type } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <ConfigModal
                    title={type === TYPE.EDIT ? "Sửa kỹ năng" : "Xóa kỹ năng"}
                    namebtn1="Hủy"
                    namebtn2={type === TYPE.EDIT ? "Cập nhật" : "Xóa"}
                    isOpen={openModal}
                    toggleModal={() => { this.setState({ openModal: !openModal }) }}
                    handleOk={async () => type === TYPE.EDIT ? this.editSkills() : this.removeSkills()}
                    handleClose={async () => this.toggleModal()}
                >
                    {type === TYPE.EDIT ?
                        (<InputTitle
                            title="Sửa tên tỉnh"
                            type={TYPE.INPUT}
                            value={name}
                            placeholder="Tên tỉnh"
                            onChange={event => this.setState({ name: event })}
                            widthInput="250px"
                        />) : <div>Bạn chắc chắn sẽ xóa kỹ năng: {name}</div>
                    }
                </ConfigModal>
                <div>
                    <h5>
                        Danh sách kỹ năng
                        <Button
                            onClick={() => { }}
                            type="primary"
                            size="default"
                            style={{
                                float: "right",
                            }}
                        >

                            <Link to='/admin/data/skills/create'>
                                <Icon type="plus" />
                                Thêm kỹ năng mới
                            </Link>
                        </Button>
                    </h5>
                    <Table
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table} scroll={{ x: 1000 }}
                        bordered
                        pagination={{ total: totalItems }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRowClick={event => { console.log(event); this.setState({ id: event.key, name: event.name }) }}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListSkills: (pageIndex, pageSize) => dispatch({ type: REDUX_SAGA.SKILLS.GET_SKILLS, pageIndex, pageSize })
})

const mapStateToProps = (state, ownProps) => ({
    list_skills: state.Skills.items,
    totalItems: state.Skills.totalItems
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListSkills)