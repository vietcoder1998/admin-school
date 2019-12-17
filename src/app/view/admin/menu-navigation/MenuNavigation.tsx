import React from 'react'
import { Layout, Menu, Icon } from 'antd';
// @ts-ignore
import logo from '../../../../assets/image/logo-white.png'
// @ts-ignore
import logoIcon from '../../../../assets/image/logo-icon-white.png'
import { Link } from 'react-router-dom';
import './MenuNavigation.scss';
import { routePath, routeLink } from '../../../../common/const/break-cumb';

const { Sider } = Layout;
const { SubMenu } = Menu;

interface IMenuNavigationProps {
    show_menu: boolean,
    onCallLoading: Function,
}

export default function MenuNavigation(props: IMenuNavigationProps) {
    let { show_menu } = props;
    let state_bar: any = '20';
    
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
                onClick={(event: any) => {
                    localStorage.setItem("state_bar", event.key);
                    props.onCallLoading()
                }}>
                <SubMenu
                    key="sub0"
                    title={
                        <span>
                            <Icon type="file-done" />
                            <span>Bài đăng</span>
                        </span>
                    }
                >
                    <Menu.Item key="20">
                        <Link to='/admin/pending-jobs/list'>
                            <Icon type="audit" />
                            <span>Xét duyệt bài đăng</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="21">
                        <Link to='/admin/pending-jobs/create'>
                            <Icon type="file-search" />
                            <span>Đăng hộ bài</span>
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub1"
                    title={
                        <span>
                            <Icon type="form" />
                            <span>Bài viết</span>
                        </span>
                    }
                >
                    <Menu.Item key="0">
                        <Link to='/admin/job-management/create'>
                            <Icon type="file-add" theme="filled" />
                            <span>Tạo bài viết mới</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <Link to='/admin/job-management/list'>
                            <Icon type="file-search" />
                            <span>Quản lý bài viết</span>
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
                <SubMenu
                    key="sub4"
                    title={
                        <span>
                            <Icon type="property-safety" />
                            <span>Quản lí tài khoản</span>
                        </span>
                    }
                >
                    <Menu.Item key="19">
                        <Link to={routeLink.USER_CONTROLLER + routePath.LIST }>
                            <Icon type="user" />
                            <span>Người dùng</span>
                        </Link>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    )
}

