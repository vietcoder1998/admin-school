import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table, Button } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { IJobName } from '../../../../../../redux/models/job-type';

interface ListJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
}

interface ListJobNamesState {
    list_jobNames: Array<IJobName>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
}

class ListJobNames extends PureComponent<ListJobNamesProps, ListJobNamesState> {
    constructor(props) {
        super(props);
        this.state = {
            list_jobNames: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
        }
    }

    async componentDidMount() {
        await this.props.getListJobNames(0, 10);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_jobNames !== prevState.list_jobNames) {
            let data_table = [];
            let { pageIndex } = prevState;
            nextProps.list_jobNames.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    name: item.name,
                });
            })

            return {
                list_jobNames: nextProps.list_jobNames,
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
            title: 'Loại công việc',
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
            render: () => this.EditContent,
        },
    ];

    setPageIndex = async (event) => {
        await this.setState({ pageIndex: event.current - 1, loading_table: true });
        await this.props.getListJobNames(event.current - 1)
    }

    render() {
        let { data_table, loading_table } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <div>
                    <h5>
                        Danh sách tên công việc
                        <Button
                            type="primary"
                            icon="plus"
                            style={{ float: "right" }}
                        >
                            Thêm công việc mới
                        </Button>
                    </h5>
                    <div className="table">

                    </div>
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
    getListJobNames: (pageIndex, pageSize) => dispatch({ type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAME, pageIndex, pageSize })
})

const mapStateToProps = (state, ownProps) => ({
    list_jobNames: state.JobNames.items,
    totalItems: state.JobNames.totalItems
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListJobNames)