import React, { PureComponent } from 'react'
import { Layout, Icon, Avatar } from 'antd';
import MenuNavigation from './menu-navigation/MenuNavigation';
import './Admin.scss';
import ErrorBoundaryRoute from '../../../routes/ErrorBoundaryRoute';
import PendingJobs from './pending-jobs/PendingJobs';
import { REDUX_SAGA } from '../../../common/const/actions';
import { connect } from 'react-redux';
import JobManagement from './job-management/JobManagement';

const Switch = require("react-router-dom").Switch;
const { Content, Header } = Layout;

interface AdminState {
    show_menu: boolean;
}

interface AdminProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getJobTypes: Function
}

class Admin extends PureComponent<AdminProps, AdminState> {
    constructor(props) {
        super(props);
        this.state = {
            show_menu: true,
        }
    }

    componentDidMount() {
        this.props.getJobTypes();
        
    }

    render() {
        let { show_menu } = this.state;
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
    getJobTypes: (body) => dispatch({
        type: REDUX_SAGA.JOB_TYPE.GET_JOB_TYPE,
        body
    })
})

const mapStateToProps = (state, ownProps) => ({
    list_jobs_type: state.JobType.items
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Admin)