import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Button, Icon, Table } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { ILanguage } from '../../../../../../redux/models/languages';

interface ListSkillsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListSkills: Function;
}

interface ListSkillsState {
    list_skills: Array<ILanguage>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
}

class ListSkills extends PureComponent<ListSkillsProps, ListSkillsState> {
    constructor(props) {
        super(props);
        this.state = {
            list_skills: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
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

    columns = [
        {
            title: '#',
            width: 150,
            dataIndex: 'index',
            key: 'index',
            className: 'action',
        },
        {
            title: 'Tên Kĩ năng',
            dataIndex: 'name',
            key: 'name',
            width: 700,
            className: 'action',

        },
        {
            title: 'Thao tác',
            key: 'operation',
            className: 'action',
            width: 300,
            fixed: "right",
            render: () => <Button onClick={async () => { }} type="primary"><Icon type="file-search" /></Button>,
        },
    ];

    setPageIndex =async (event) => {
        await this.setState({pageIndex: event.current -1,loading_table: true});
        this.props.getListSkills(event.current - 1)
    }

    render() {
        let { data_table, loading_table } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <div>
                    <h5>Danh sách kĩ năng</h5>
                    <Table
                        columns={this.columns}
                        loading={loading_table}
                        dataSource={data_table} scroll={{ x: 1000 }}
                        bordered
                        pagination={{ total: totalItems }}
                        size="middle"
                        onChange={this.setPageIndex}
                        onRowClick={async event => { }}
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