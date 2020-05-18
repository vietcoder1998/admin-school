import React, { PureComponent } from 'react'
import { Layout, Icon, Avatar, Breadcrumb, Row, Col, Tooltip } from 'antd';
import './Admin.scss';

import MenuNavigation from './menu-navigation/MenuNavigation';
import ErrorBoundaryRoute from '../../../routes/ErrorBoundaryRoute';
import { REDUX_SAGA, REDUX } from '../../../const/actions';
import { connect } from 'react-redux';

import Data from './data/Data';
import clearStorage from '../../../services/clearStorage';
import RoleAdmins from './roles-admin/RoleAdmins';
import PendingJobs from './pending-jobs/PendingJobs';
import User from './user/User';

import { DropdownConfig, OptionConfig } from '../layout/config/DropdownConfig';
import { breakCumb, IBrk, routePath, routeLink } from '../../../const/break-cumb';
import { IAppState } from '../../../redux/store/reducer';
import ClearCache from 'react-clear-cache';

import Loading from '../layout/loading/Loading';
import Announcement from './announcement/Announcement';
import Event from './event/Event';

const Switch = require("react-router-dom").Switch;
const { Content, Header } = Layout;

interface AdminState {
    show_menu: boolean;
    location?: string;
    data_breakcumb: Array<string>
    loading?: boolean;
}

interface AdminProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: any;
    getListJobNames: Function;
    getListTypeManagement: Function;
    getListJobGroups: Function;
    getListBranches: Function;
    getListSkills: Function;
    getListApiController: Function;
    getListRegions: Function;
    getListRoles: Function;
    handleLoading: Function;
}

class Admin extends PureComponent<AdminProps, AdminState> {
    constructor(props: any) {
        super(props);
        this.state = {
            show_menu: false,
            location: "/",
            data_breakcumb: [],
            loading: false,
        }
    }

    async componentDidMount() {
        await this.props.getListJobNames();
        await this.props.getListTypeManagement({ target: null });
        await this.props.getListJobGroups();
        await this.props.getListBranches();
        await this.props.getListApiController();
        await this.props.getListRegions();
        await this.props.getListRoles();
        await this.props.getListSkills();
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.location.pathname !== prevState.pathname) {
            localStorage.setItem("last_url", nextProps.location.pathname);
            let list_breakcumb = nextProps.location.pathname.split("/");
            let data_breakcumb: any = [];
            list_breakcumb.forEach((item: any) => item !== "" && data_breakcumb.push(item));
            window.scrollTo(0, 0);
            return {
                pathname: nextProps.location.pathname,
                data_breakcumb
            }
        }

        return { loadingTable: false };
    }

    logOut = () => {
        clearStorage()
    };

    componentWillUnmount() {
        window.removeEventListener("scroll", () => { });
    }

    render() {
        let { show_menu, data_breakcumb, loading } = this.state;
        let { match } = this.props;
        return (
            <Layout>
                <MenuNavigation
                    show_menu={show_menu}
                    onCallLoading={() => {
                        this.setState({ loading: true });
                        setTimeout(() => {
                            this.setState({ loading: false });
                        }, 300);
                    }}
                />
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>

                        <Icon
                            className="trigger"
                            type={show_menu ? 'menu-unfold' : 'menu-fold'}
                            style={{
                                marginTop: 15,
                                fontSize: 20,
                                zIndex: 999
                            }}
                            onClick={() => this.setState({ show_menu: !show_menu })}
                        />
                        <Tooltip title={"Cập nhật phiên bản"}>
                            <ClearCache>
                                {({ isLatestVersion, emptyCacheStorage }) =>
                                    <div>
                                        {!isLatestVersion && (
                                            <Icon type={'sync'}
                                                style={{
                                                    fontSize: 20,
                                                    float: "right",
                                                    margin: 15
                                                }}

                                                onClick={
                                                    () => {
                                                        this.setState({ loading: true });
                                                        emptyCacheStorage();
                                                    }
                                                }
                                                spin={loading}
                                            />
                                        )}
                                    </div>
                                }
                            </ClearCache>
                        </Tooltip>
                        <div className="avatar-header" >
                            <DropdownConfig
                                param={
                                    <Avatar
                                        icon="user"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            border: "solid #168ECD 2px",
                                            margin: "-28px 5px 0"
                                        }}
                                        src={localStorage.getItem('avatarUrl')}
                                    />
                                }
                            >
                                <OptionConfig
                                    icon="user"
                                    key="2"
                                    value=""
                                    label="Tài khoản"
                                    onClick={
                                        () => this.props.history.push(routeLink.ADMIN_ACCOUNTS + routePath.FIX + `/${localStorage.getItem('userID')}`)
                                    }
                                />
                                <OptionConfig
                                    icon="logout"
                                    key="1" value=""
                                    label="Đăng xuất"
                                    onClick={() => clearStorage()}
                                />
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
                                                {item_brk.icon ? <Icon type={item_brk.icon} style={{ margin: 3 }} /> : null}
                                                {!item_brk.disable ? <a href={item_brk.url} >{item_brk.name}</a> : <label>{item_brk.name}</label>}
                                            </Breadcrumb.Item>
                                        )
                                    }
                                })

                                return newBreakCump
                            })}
                        </Breadcrumb>
                        <Row>
                            <Col sm={1} md={1} lg={2}></Col>
                            <Col sm={22} md={22} lg={20}>
                                {!loading ? <Switch>
                                    <ErrorBoundaryRoute path={`${match.url}${routePath.PENDING_JOBS}`} component={PendingJobs} />
                                    <ErrorBoundaryRoute path={`${match.url}${routePath.ANNOUNCEMENT}`} component={Announcement} />
                                    <ErrorBoundaryRoute path={`${match.url}${routePath.DATA}`} component={Data} />
                                    <ErrorBoundaryRoute path={`${match.url}${routePath.ROLES}`} component={RoleAdmins} />
                                    <ErrorBoundaryRoute path={`${match.url}${routePath.USER}`} component={User} />
                                    <ErrorBoundaryRoute path={`${match.url}${routePath.EVENT}`} component={Event} />
                                </Switch> : <Loading />}
                            </Col >
                            <Col sm={1} md={1} lg={2}></Col>
                        </Row>
                    </Content>
                </Layout>
            </Layout >
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
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
    getListRegions: () => dispatch({
        type: REDUX_SAGA.REGIONS.GET_REGIONS
    }),
    getListRoles: () => dispatch({
        type: REDUX_SAGA.ROLES.GET_ROLES
    }),
    handleLoading: (loading: boolean) => dispatch({ type: REDUX.HANDLE_LOADING, loading })
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    loading: state.MutilBox.loading
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Admin)