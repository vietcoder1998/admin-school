import React, { PureComponent } from 'react'
import { Layout, Menu, Icon } from 'antd';
// @ts-ignore
import logo from '../../../../logo-01.png'
import { Link } from 'react-router-dom';
import './MenuNavigation.scss';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface MenuNavigationState {
}

interface MenuNavigationProps {
    show_menu: boolean,
}

export default class MenuNavigation extends PureComponent<MenuNavigationProps, MenuNavigationState> {
    constructor(props: any) {
        super(props);
        this.state = {
        }
    }

    render() {
        let { show_menu } = this.props;
        let state_bar: any = '1';
        if (localStorage.getItem("state_bar")) {
            state_bar = localStorage.getItem("state_bar")
        }
        return (
            <Sider trigger={null} collapsible collapsed={show_menu}>
                <div className="logo" style={{ padding: show_menu ? "20px 0px" : "0px 0px" }} >
                    <img src={logo} style={{ height: "40px", display: !show_menu ? "block" : "none" }} alt="worksvnlogo" />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[state_bar]} onClick={event => localStorage.setItem("state_bar", event.key)}>
                    <Menu.Item key="1" >
                        <Link to='/admin/pending-jobs' >
                            <Icon type="hourglass" />
                            <span>Bài đăng đang chờ</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to='/admin/job-management/list' >
                            <Icon type="book" />
                            <span>Quản lí bài viết</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="database" />
                                <span>Danh mục dữ liệu</span>
                            </span>
                        }
                    >
                        <Menu.Item key="7">
                            <Link to={'/admin/data/languages/list'}>
                                <Icon type="message" />
                                <span>Ngôn ngữ</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="8">
                            <Link to={'/admin/data/majors/list'}>
                                <Icon type="contacts" />
                                <span>Chuyên ngành</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="9">
                            <Link to={'/admin/data/regions/list'}>
                                <Icon type="environment" />
                                <span>Tỉnh thành</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="10">
                            <Link to={'/admin/data/job-names/list'}>
                                <Icon type="idcard" />
                                <span>Loại công việc</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="11">
                            <Link to={'/admin/data/type-schools/list'}>
                                <Icon type="reconciliation" />
                                <span>Loại trường</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="12">
                            <Link to={'/admin/data/skills/list'}>
                                <Icon type="profile" />
                                <span>Kĩ năng</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="13">
                            <Link to={'/admin/data/job-groups/list'}>
                                <Icon type="team" />
                                <span>Nhóm công việc</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="14">
                            <Link to={'/admin/data/branches/list'}>
                                <Icon type="apartment" />
                                <span>Nhóm ngành</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub3"
                        title={
                            <span>
                                <Icon type="property-safety" />
                                <span>Quản trị viên</span>
                            </span>
                        }
                    >
                        <Menu.Item key="16">
                            <Link to='/admin/role-admins/roles/list' >
                                <Icon type="user" />
                                <span>Phân quyền</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider >
        )
    }
}

