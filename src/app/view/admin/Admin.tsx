import React, { PureComponent } from 'react'
import { Layout, Icon, Avatar, Dropdown, Menu } from 'antd';
import MenuNavigation from './menu-navigation/MenuNavigation';
import './Admin.scss';
import ErrorBoundaryRoute from '../../../routes/ErrorBoundaryRoute';
import PendingJobs from './pending-jobs/PendingJobs';
import { REDUX_SAGA } from '../../../common/const/actions';
import { connect } from 'react-redux';
import JobManagement from './job-management/JobManagement';
import clearStorage from '../../../services/clearStorage';

const Switch = require("react-router-dom").Switch;
const { Content, Header } = Layout;

interface AdminState {
    show_menu: boolean;
    to_logout: boolean;
}

interface AdminProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getJobNames: Function;
    getTypeManagement: Function;
}

class Admin extends PureComponent<AdminProps, AdminState> {
    constructor(props) {
        super(props);
        this.state = {
            show_menu: true,
            to_logout: false,
        }
    }

    async componentDidMount() {
        await this.props.getJobNames();
        await this.props.getTypeManagement({target: null});
    }

    menu = (
        <Menu>
            <Menu.Item onClick={() => clearStorage()}>
                <span>
                    Đăng xuất
                </span>
            </Menu.Item>
        </Menu>
    );

    render() {
        let { show_menu, to_logout } = this.state;
        let { match } = this.props;

        return (
            <Layout>
                <MenuNavigation show_menu={show_menu} />
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={show_menu ? 'menu-unfold' : 'menu-fold'}
                            style={{
                                marginTop: "20px"
                            }}
                            onClick={() => this.setState({ show_menu: !show_menu })}
                        />
                        <div className="avatar-header" >
                            <Avatar
                                icon="user"
                                style={{
                                    width: "30px",
                                    height: "30px",
                                }}
                            />
                            <Dropdown
                                overlay={this.menu}
                                placement="topRight"
                            >
                                <Icon
                                    type={"down"}
                                    style={{
                                        padding: "20px 10px"
                                    }}
                                    onClick={() => this.setState({ to_logout: !to_logout })}
                                />
                            </Dropdown>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        <Switch>
                            <ErrorBoundaryRoute path={`${match.url}/pending-jobs`} component={PendingJobs} />
                            <ErrorBoundaryRoute path={`${match.url}/job-management`} component={JobManagement} />
                        </Switch>
                    </Content>
                </Layout>

            </Layout >
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getJobNames: (body) => dispatch({
        type: REDUX_SAGA.JOB_NAME.GET_JOB_NAME,
        body
    }),
    getTypeManagement: (data) => dispatch({
        type: REDUX_SAGA.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT,data
    })
})

const mapStateToProps = (state, ownProps) => ({
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Admin)