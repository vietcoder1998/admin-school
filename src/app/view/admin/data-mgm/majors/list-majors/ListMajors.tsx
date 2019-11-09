import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { IMajor } from '../../../../../../redux/models/majors';
import { Link } from 'react-router-dom';

interface ListMajorsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListMajors: Function;
}

interface ListMajorsState {
    list_majors: Array<IMajor>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
}

class ListMajors extends PureComponent<ListMajorsProps, ListMajorsState> {
    constructor(props) {
        super(props);
        this.state = {
            list_majors: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
        }
    }

    async componentDidMount() {
        await this.props.getListMajors(0, 10);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_majors !== prevState.list_majors) {
            let data_table = [];
            let { pageIndex } = prevState;
            nextProps.list_majors.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    name: item.name,
                    branchName: item.branch ? item.branch.name : "Khác"
                });
            })

            return {
                list_majors: nextProps.list_majors,
                data_table,
                loading_table: false
            }
        }
        return null;
    }


    EditContent = (
        <div>
            <Icon style={{ padding: "5px 10px" }} type="delete" onClick={() => { }} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" onClick={() => { }} />
        </div>
    )

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
            title: 'Hình thức',
            dataIndex: 'branchName',
            key: 'branchName',
            width: 400,
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

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true });
        this.props.getListMajors(event.current - 1)
    }

    render() {
        let { data_table, loading_table } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <div>
                    <h5>
                        Danh sách ngành nghề
                        <Button
                            type="primary"
                            style={{
                                float: "right",
                            }}
                        >
                            <Link to='/admin/data/majors/create'>
                                <Icon type="plus" />
                                Thêm ngành nghề mới
                            </Link>
                        </Button>
                    </h5>
                    <div className="table">
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
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getListMajors: (pageIndex, pageSize) => dispatch({ type: REDUX_SAGA.MAJORS.GET_MAJORS, pageIndex, pageSize })
})

const mapStateToProps = (state, ownProps) => ({
    list_majors: state.Majors.items,
    totalItems: state.Majors.totalItems
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListMajors)