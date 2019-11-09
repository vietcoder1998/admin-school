import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Icon, Table } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { ILanguage } from '../../../../../../redux/models/languages';

interface ListRegionsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListRegions: Function;
}

interface ListRegionsState {
    list_regions: Array<ILanguage>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
}

class ListRegions extends PureComponent<ListRegionsProps, ListRegionsState> {
    constructor(props) {
        super(props);
        this.state = {
            list_regions: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
        }
    }

    async componentDidMount() {
        await this.props.getListRegions(0, 10);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_regions !== prevState.list_regions) {
            let data_table = [];
            let { pageIndex } = prevState;
            nextProps.list_regions.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    name: item.name,
                });
            })

            return {
                list_regions: nextProps.list_regions,
                data_table,
                loading_table: false
            }
        }
        return null;
    }

    
    EditContent = (
        <div>
            <Icon style={{ padding: "5px 10px" }} type="delete" onClick={() =>{}} />
            <Icon key="edit" style={{ padding: "5px 10px" }} type="edit" onClick={() => {}} />
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
            title: 'Tên tỉnh thành',
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

    setPageIndex =async (event) => {
        await this.setState({pageIndex: event.current -1,loading_table: true});
        this.props.getListRegions(event.current - 1)
    }

    render() {
        let { data_table, loading_table } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <div>
                    <h5>Danh sách tỉnh thành</h5>
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
    getListRegions: (pageIndex, pageSize) => dispatch({ type: REDUX_SAGA.REGIONS.GET_REGIONS, pageIndex, pageSize })
})

const mapStateToProps = (state, ownProps) => ({
    list_regions: state.Regions.items,
    totalItems: state.Regions.totalItems
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListRegions)