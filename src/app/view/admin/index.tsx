import React, { PureComponent } from 'react'
import { Layout, Icon, Avatar, Breadcrumb, Row, Col, Tooltip, Cascader, BackTop, Tabs, Input, Affix } from 'antd';

import MenuNavigation from './menu-navigation/MenuNavigation';
import ErrorBoundaryRoute from '../../../routes/ErrorBoundaryRoute';
import { REDUX_SAGA, REDUX } from '../../../const/actions';
import { connect } from 'react-redux';

import Data from './data';
import clearStorage from '../../../services/clear-storage';
import RoleAdmins from './roles-admin';
import User from './user';

import { DropdownConfig, OptionConfig } from '../layout/config/DropdownConfig';
import { breakCumb, IBrk, routePath, routeLink, routeOption, mapApiFolder } from '../../../const/break-cumb';
import { IAppState } from '../../../redux/store/reducer';
import ClearCache from 'react-clear-cache';

import Loading from '../layout/loading/Loading';
import Announcement from './announcement';
import Event from './event';
import Connect from './connect';

//@ts-ignore
import Jobs from './jobs';
import { PendingJobs } from '../../../redux/reducers/pending-jobs';
import PendingJobsList from './jobs/pending-jobs-list/PendingJobsList';
import DetailRouter from '../../../routes/DetailRouter';
import DefaultBanner from '../layout/common/DefaultBanner';
import rtCpn from '../../../routes/DetailRouter';

const Switch = require("react-router-dom").Switch;
const { Content, Header } = Layout;
//@ts-ignore


interface AdminState {
    show_menu: boolean;
    location?: string;
    data_breakcumb: Array<string>
    loading?: boolean;
    showCas?: boolean;
    api?: string;
    activeKey?: string;
    panes?: any;
    content?: JSX.Element;
}

interface AdminProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: any;
    getListJobNames: Function;
    getListTypeManagement: Function;
    getListJobGroups: Function;
    getListBranches: Function;
    getListSkills: Function;
    getListLanguages: Function;
    getListApiController: Function;
    getListRegions: Function;
    getListRoles: Function;
    handleLoading: Function;
    getProfileAdmin: Function;
}

class Admin extends PureComponent<AdminProps, AdminState> {
    constructor(props: any) {
        super(props);
        const panes = [
            {
                title: 'Mặc định',
                content: this.tabDefault({ loading: false, match: this.props.match }),
                key: '0',
                closable: false,
                find: true,
                api: null,
            },
            {
                title: 'Tab1',
                content: <DefaultBanner />,
                key: '1',
                api: null,
                find: false,
            },
        ];
        this.state = {
            show_menu: false,
            location: "/",
            data_breakcumb: [],
            loading: false,
            showCas: false,
            api: '/admin',
            activeKey: panes[0].key,
            panes,
        }
    }

    newTabIndex = 0;
    api = "";
    content = null;

    find = () => {
        return <Cascader
            placeholder="Tìm kiếm thư mục"
            showSearch={true}
            options={routeOption}
            onChange={
                (event: any) => {
                    let api = mapApiFolder(event);
                    const { panes, activeKey } = this.state;
                    panes[activeKey].content = rtCpn({ route: api });
                    panes[activeKey].title = api;
                    this.setState({ panes });
                    this.forceUpdate();
                }
            }
        />
    }

    add = () => {
        const { panes } = this.state;
        const activeKey = `newkey${panes.length+1}`
        panes.push({ title: 'New Tab', content: <DefaultBanner />, key: activeKey, show: true });
        this.setState({ panes, activeKey });
    };

    remove = targetKey => {
        let { activeKey } = this.state;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
        this.setState({ panes, activeKey });
    };

    onChange = activeKey => {
        let { panes } = this.state;
        console.log(activeKey);

        let newPanes = panes.map((item, index) => {
            if (item.key === activeKey) {
                item.find = true;
            } else {
                item.find = false;
            }

            return item;
        })
        this.setState({ activeKey, panes: newPanes });
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    async componentDidMount() {
        await this.props.getProfileAdmin(localStorage.getItem('userID'));
        await this.props.getListJobNames();
        await this.props.getListTypeManagement({ target: null });
        await this.props.getListJobGroups();
        await this.props.getListBranches();
        await this.props.getListLanguages();
        await this.props.getListApiController();
        await this.props.getListRegions();
        await this.props.getListRoles();
        await this.props.getListSkills();
    }

    static getDerivedStateFromProps(nextProps?: any, prevState?: any) {
        if (nextProps.location.pathname !== prevState.pathname && prevState !== "/login") {
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

    async componentWillUnmount() {
        window.removeEventListener("scroll", () => { });
    }

    tabDefault = ({ loading, match }) => (<Row>
        {/* <Col sm={1} md={1} lg={2}></Col> */}
        <Col sm={24} md={24} lg={24}>
            {!loading ? <Switch>
                <ErrorBoundaryRoute exact path={null || '/admin'} component={DefaultBanner} />
                <ErrorBoundaryRoute path={`${match.url + routePath.JOBS}`} component={Jobs} />
                <ErrorBoundaryRoute path={`${match.url + routePath.ANNOUNCEMENT}`} component={Announcement} />
                <ErrorBoundaryRoute path={`${match.url + routePath.DATA}`} component={Data} />
                <ErrorBoundaryRoute path={`${match.url + routePath.ROLES}`} component={RoleAdmins} />
                <ErrorBoundaryRoute path={`${match.url + routePath.USER}`} component={User} />
                <ErrorBoundaryRoute path={`${match.url + routePath.EVENT}`} component={Event} />
                <ErrorBoundaryRoute path={`${match.url + routePath.CONNECT}`} component={Connect} />
            </Switch> : <Loading />}
        </Col >
        {/* <Col sm={1} md={1} lg={2}></Col> */}
    </Row>)


    render() {
        let { show_menu, data_breakcumb, loading, showCas, api } = this.state;
        let { match } = this.props;
        let name = localStorage.getItem("name");
        if (name && name.length > 5) {
            name = name.slice(0, 5) + "...";
        }
        return (
            <Layout>
                <BackTop />
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
                    <Header
                        style={{
                            background: '#fff',
                            padding: 0,
                            boxShadow: "2px 5px 5px -3px rgba(173,173,173,1)",
                            border: "none"
                        }}
                    >
                        <Icon
                            className="trigger"
                            type={show_menu ? 'menu-unfold' : 'menu-fold'}
                            style={{
                                marginTop: 15,
                                fontSize: 20,
                                zIndex: 999,
                                color: 'white'
                            }}
                            onClick={() => this.setState({ show_menu: !show_menu })}
                        />
                        <Tooltip title="Tìm chỉ mục " placement={"bottom"}>
                            <Icon
                                className="trigger"
                                type="search"
                                style={{
                                    margin: "15px 20px",
                                    fontSize: 20,
                                    zIndex: 999,
                                    color: 'white',
                                }}
                                onClick={() => this.setState({ showCas: !showCas })}
                            />
                        </Tooltip>
                        <Cascader
                            placeholder="Tìm kiếm thư mục"
                            style={{
                                margin: "9px 5% 9px 0",
                                zIndex: showCas ? 999 : -1,
                                borderColor: "white",
                                width: "40%",
                                top: showCas ? -60 : 0
                            }}
                            showSearch={true}
                            options={routeOption}
                            onChange={
                                (event: any) => window.location.href =  mapApiFolder(event) 
                            }
                        />
                        <Tooltip title={"Cập nhật phiên bản"}>
                            <ClearCache auto={true} duration={6000}>
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
                                    <>
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
                                        <span className="avt-name">
                                            {localStorage.getItem("name")}
                                        </span>
                                    </>
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
                        <Tabs
                            onChange={this.onChange}
                            activeKey={this.state.activeKey}
                            type="editable-card"
                            onEdit={this.onEdit}
                        >
                            {this.state.panes.map(pane => (
                                <Tabs.TabPane
                                    tab={!pane.find || pane.key === '0' ? pane.title : this.find()}
                                    key={pane.key}
                                    closable={pane.closable}
                                >
                                    <Breadcrumb
                                        style={{ padding: 20 }}
                                    >
                                        <Breadcrumb.Item >
                                            <a href='/admin' >
                                        <Icon type="home" />
                                        Trang chủ
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
                                    {pane.content}
                                </Tabs.TabPane>
                            ))}
                        </Tabs>
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
    getListLanguages: () => dispatch({
        type: REDUX_SAGA.LANGUAGES.GET_LANGUAGES
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
    handleLoading: (loading: boolean) => dispatch({
        type: REDUX.HANDLE_LOADING, loading
    }),
    getProfileAdmin: (id?: string) => dispatch({
        type: REDUX_SAGA.ADMIN_ACCOUNTS.GET_ADMIN_ACCOUNT_DETAIL, id
    }),
});

const mapStateToProps = (state?: IAppState, ownProps?: any) => ({
    loading: state.MutilBox.loading
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Admin)