import React, { PureComponent } from 'react'
import { Layout, Icon, Avatar, Breadcrumb } from 'antd';
import MenuNavigation from './menu-navigation/MenuNavigation';
import './Admin.scss';
import ErrorBoundaryRoute from '../../../routes/ErrorBoundaryRoute';
import { REDUX_SAGA, REDUX } from '../../../common/const/actions';
import { connect } from 'react-redux';
import JobManagement from './job-management/JobManagement';
import DataMgm from './data-mgm/DataMgm';
import clearStorage from '../../../services/clearStorage';
import { breakCumb, IBrk } from '../../../common/const/break-cumb';
import RoleAdmins from './role-admins/RoleAdmins';
import { DropdownConfig, OptionConfig } from '../layout/config/DropdownConfig';
import Loading from '../layout/loading/Loading';

import { IAppState } from '../../../redux/store/reducer';
import PendingJobs from './pending-jobs/PendingJobs';

const Switch = require("react-router-dom").Switch;
const { Content, Header } = Layout;

interface AdminState {
    show_menu: boolean;
    location?: string;
    data_breakcumb: Array<string>
}

interface AdminProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
    getListJobGroups: Function;
    getListBranches: Function;
    getListSkills: Function;
    getListApiController: Function;
    handleLoading: Function;
}


class Admin extends PureComponent<AdminProps, AdminState> {
    constructor(props: any) {
        super(props);
        this.state = {
            show_menu: false,
            location: "/",
            data_breakcumb: []
        }
    }

    async componentDidMount() {
        await this.props.getListJobNames();
        await this.props.getListTypeManagement({ target: null });
        await this.props.getListJobGroups();
        await this.props.getListBranches();
        await this.props.getListApiController();
        await this.props.getListSkills();
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.location.pathname !== prevState.pathname) {
            localStorage.setItem("last_url", nextProps.location.pathname);
            let list_breakcumb = nextProps.location.pathname.split("/");
            let data_breakcumb: any = [];
            list_breakcumb.forEach((item: any) => item !== "" && data_breakcumb.push(item));
            window.scrollTo(0, 0);
            setTimeout(() => {
                nextProps.handleLoading(false);
            }, 250);

            return {
                pathname: nextProps.location.pathname,
                data_breakcumb
            }
        }

        return null;
    }

    logOut = () => {
        clearStorage()
    };

    componentWillUnmount() {
        window.removeEventListener("scroll", () => { });
    }

    render() {
        let { show_menu, data_breakcumb } = this.state;
        let { match, loading } = this.props;
        return (
            <Layout>
                <MenuNavigation
                    show_menu={show_menu}
                    onCallLoading={() => this.props.handleLoading(true)}
                />
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
                            <DropdownConfig
                                param={
                                    <Avatar
                                        icon="user"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            border: "solid #fff 2px",
                                            margin: "0px 5px"
                                        }}
                                    />
                                }
                            >
                                <OptionConfig icon="user" key="2" value="" label="Tài khoản" onClick={() => { }} />
                                <OptionConfig icon="logout" key="1" value="" label="Đăng xuất" onClick={() => clearStorage()} />
                            </DropdownConfig>
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                            border: "solid #80808036 1px"
                        }}
                    >
                        <Breadcrumb >
                            <Breadcrumb.Item >
                                <a href='/admin' >
                                    <Icon type="home" />
                                </a>
                            </Breadcrumb.Item>
                            {data_breakcumb.map((item: any) => {
                                let newBreakCump = null;
                                breakCumb.forEach((item_brk: IBrk, index: number) => {
                                    if (item_brk.label === item) {
                                        newBreakCump = (
                                            <Breadcrumb.Item key={index}>
                                                {item_brk.icon ? <Icon type={item_brk.icon} /> : null}
                                                {!item_brk.disable ? <a href={item_brk.url} >{item_brk.name}</a> : <label>{item_brk.name}</label>}
                                            </Breadcrumb.Item>
                                        )
                                    }
                                })

                                return newBreakCump
                            })}
                        </Breadcrumb>
                        <Switch>

                            {!loading ? <Switch>
                                <ErrorBoundaryRoute path={`${match.url}/pending-jobs`} component={PendingJobs} />
                                <ErrorBoundaryRoute path={`${match.url}/job-management`} component={JobManagement} />
                                <ErrorBoundaryRoute path={`${match.url}/data`} component={DataMgm} />
                                <ErrorBoundaryRoute path={`${match.url}/role-admins`} component={RoleAdmins} />
                            </Switch> : <Loading />}

                        </Switch>
                    </Content>
                </Layout>
            </Layout >
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListJobNames: (body: any) => dispatch({
        type: REDUX_SAGA.JOB_NAMES.GET_JOB_NAMES,
        body
    }),
    getListTypeManagement: (data: any) => dispatch({
        type: REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES, data
    }),
    getListJobGroups: () => dispatch({
        type: REDUX_SAGA.JOB_GROUPS.GET_JOB_GROUPS
    }),
    getListBranches: () => dispatch({
        type: REDUX_SAGA.BRANCHES.GET_BRANCHES
    }),
    getListApiController: () => dispatch({
        type: REDUX_SAGA.API_CONTROLLER.GET_API_CONTROLLER
    }),
    getListSkills: () => dispatch({
        type: REDUX_SAGA.SKILLS.GET_SKILLS
    }),
    handleLoading: (loading: boolean) => dispatch({ type: REDUX.HANDLE_LOADING, loading })
});

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    loading: state.MutilBox.loading
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Admin)