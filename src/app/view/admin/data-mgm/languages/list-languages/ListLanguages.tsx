import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Button, Icon, Table } from 'antd';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { ILanguage } from '../../../../../../redux/models/languages';

interface ListLanguagesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListLanguages: Function;
}

interface ListLanguagesState {
    list_languages: Array<ILanguage>,
    loading_table: boolean;
    data_table: Array<any>;
    pageIndex: number;
}

class ListLanguages extends PureComponent<ListLanguagesProps, ListLanguagesState> {
    constructor(props) {
        super(props);
        this.state = {
            list_languages: [],
            loading_table: true,
            data_table: [],
            pageIndex: 0,
        }
    }

    async componentDidMount() {
        await this.props.getListLanguages(0, 10);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.list_languages !== prevState.list_languages) {
            let data_table = [];
            let { pageIndex } = prevState;
            nextProps.list_languages.forEach((item, index) => {
                data_table.push({
                    key: item.id,
                    index: (index + pageIndex * 10 + 1),
                    name: item.name,
                });
            })

            return {
                list_languages: nextProps.list_languages,
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
            title: 'Tên ngôn ngữ',
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
        await this.setState({pageIndex: event, loading_table: true});
        this.props.getListLanguages(event.current - 1)
    }

    render() {
        let { data_table, loading_table, list_languages } = this.state;
        let { totalItems } = this.props;
        return (
            <Fragment >
                <div>
                    <h5>Danh sách ngôn ngữ</h5>
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
    getListLanguages: (pageIndex, pageSize) => dispatch({ type: REDUX_SAGA.LANGUAGES.GET_LANGUAGES, pageIndex, pageSize })
})

const mapStateToProps = (state, ownProps) => ({
    list_languages: state.Languages.items,
    totalItems: state.Languages.totalItems
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ListLanguages)