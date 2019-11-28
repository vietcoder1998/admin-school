import React, { PureComponent } from 'react'
import { Layout, Menu, Icon } from 'antd';
// @ts-ignore
import logo from '../../../../assets/image/logo-white.png'
// @ts-ignore
import logoIcon from '../../../../assets/image/logo-icon-white.png'
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
        this.state = {}
    }

    render() {
        let { show_menu } = this.props;
        let state_bar: any = '1';
        if (localStorage.getItem("state_bar")) {
            state_bar = localStorage.getItem("state_bar")
        }
        return (
            <Sider trigger={null} collapsible collapsed={show_menu} width={210}>
                <div className="logo" style={{ padding: show_menu ? "20px 0px" : "0px 0px" }}>
                    <img src={show_menu ? logoIcon : logo} style={{ height: "30px", marginLeft: 12, marginTop: 10 }}
                        alt="logo" />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[state_bar]}
                    onClick={event => localStorage.setItem("state_bar", event.key)}>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="file-done" />
                                <span>Bài đăng tuyển dụng</span>
                            </span>
                        }
                    >
                        <Menu.Item key="1">
                            <Link to='/admin/job-management/list'>
                                <Icon type="file-search" />
                                <span>Quản lý bài đăng</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to='/admin/pending-jobs'>
                                <Icon type="audit" />
                                <span>Xét duyệt bài đăng</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="database" />
                                <span>Danh mục dữ liệu</span>
                            </span>
                        }
                    >
                        <Menu.Item key="3">
                            <Link to={'/admin/data/languages/list'}>
                                <Icon type="message" />
                                <span>Ngôn ngữ</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to={'/admin/data/majors/list'}>
                                <Icon type="contacts" />
                                <span>Chuyên ngành</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to={'/admin/data/regions/list'}>
                                <Icon type="environment" />
                                <span>Tỉnh thành</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Link to={'/admin/data/job-names/list'}>
                                <Icon type="idcard" />
                                <span>Loại công việc</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="7">
                            <Link to={'/admin/data/type-schools/list'}>
                                <Icon type="reconciliation" />
                                <span>Loại trường</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="8">
                            <Link to={'/admin/data/skills/list'}>
                                <Icon type="profile" />
                                <span>Kĩ năng</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="9">
                            <Link to={'/admin/data/job-groups/list'}>
                                <Icon type="team" />
                                <span>Nhóm công việc</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="10">
                            <Link to={'/admin/data/branches/list'}>
                                <Icon type="apartment" />
                                <span>Nhóm ngành</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="11">
                            <Link to={'/admin/data/annou-types/list'}>
                                <Icon type="container" />
                                <span>Nhóm bài viết</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub3"
                        title={
                            <span>
                                <Icon type="property-safety" />
                                <span>Quản trị</span>
                            </span>
                        }
                    >
                        <Menu.Item key="12">
                            <Link to='/admin/role-admins/roles/list'>
                                <Icon type="user" />
                                <span>Phân quyền</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="13">
                            <Link to='/admin/role-admins/admin-accounts/list'>
                                <Icon type="key" />
                                <span>Tài khoản admin</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

