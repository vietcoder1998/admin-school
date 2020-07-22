import React from 'react'
import { Layout, Menu, Icon } from 'antd';
// @ts-ignore
import logo from '../../../../assets/image/logo-white.png'
// @ts-ignore
import logoIcon from '../../../../assets/image/logo-icon-white.png'
import { Link } from 'react-router-dom';
import './MenuNavigation.scss';
import { routePath, routeLink } from '../../../../const/break-cumb';

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
        <Sider
            trigger={null}
            collapsible collapsed={show_menu}
            width={210}
        >
            <div className="logo" style={{ padding: show_menu ? "20px 0px" : "0px 0px" }}>
                <img src={show_menu ? logoIcon : logo} style={{ height: "30px", marginLeft: 12, marginTop: 10 }}
                    alt="logo" />
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[state_bar]}
                style={{
                    borderRight: "none",
                    margin: "50px 0px",
                    paddingBottom: 100,
                    height: "100vh",
                    overflowY: "auto",
                    position: "absolute",
                    top: 0,
                    left: 0
                }}
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
                    <Menu.Item key="16">
                        <Link to={routeLink.JOB_ANNOUNCEMENTS + routePath.LIST}>
                            <Icon type="reconciliation" />
                            <span>Danh sách</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="14">
                        <Link to='/admin/pending-jobs/list'>
                            <Icon type="audit" />
                            <span>Xét duyệt</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="15">
                        <Link to='/admin/pending-jobs/create'>
                            <Icon type="plus-square" />
                            <span>Đăng hộ</span>
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
                    <Menu.Item key="event-create">
                        <Link to={routeLink.ANNOUCEMENT + routePath.CREATE}>
                            <Icon type="file-add" />
                            <span>Tạo mới</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="event-list">
                        <Link to={routeLink.ANNOUCEMENT + routePath.LIST}>
                            <Icon type="reconciliation" />
                            <span>Danh sách </span>
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="event"
                    title={
                        <span>
                            <Icon type="star" />
                            <span>Sự kiện</span>
                        </span>
                    }
                >
                    <Menu.Item key="1">
                        <Link to={routeLink.EVENT + routePath.LIST}>
                            <Icon type="reconciliation" />
                            <span>Danh sách </span>
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub2"
                    title={
                        <span>
                            <Icon type="database" />
                            <span>Dữ liệu</span>
                        </span>
                    }
                >
                    <Menu.Item key="3">
                        <Link to={routeLink.LANGUAGES + routePath.LIST}>
                            <Icon type="message" />
                            <span>Ngôn ngữ</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link to={routeLink.MAJORS + routePath.LIST}>
                            <Icon type="contacts" />
                            <span>Chuyên ngành</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <Link to={routeLink.REGIONS + routePath.LIST}>
                            <Icon type="environment" />
                            <span>Tỉnh thành</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Link to={routeLink.JOB_NAMES + routePath.LIST}>
                            <Icon type="idcard" />
                            <span>Loại công việc</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <Link to={routeLink.TYPE_SCHOOLS + routePath.LIST}>
                            <Icon type="reconciliation" />
                            <span>Loại trường</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link to={routeLink.SKILLS + routePath.LIST}>
                            <Icon type="profile" />
                            <span>Kĩ năng</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                        <Link to={routeLink.JOB_GROUPS + routePath.LIST}>
                            <Icon type="team" />
                            <span>Nhóm công việc</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="10">
                        <Link to={routeLink.BRANCHES + routePath.LIST}>
                            <Icon type="apartment" />
                            <span>Nhóm ngành</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="11">
                        <Link to={routeLink.ANNOU_TYPE + routePath.LIST}>
                            <Icon type="container" />
                            <span>Nhóm bài viết</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="working-tools">
                        <Link to={routeLink.WORKING_TOOL + routePath.LIST}>
                            <Icon type="tool" />
                            <span>Công cụ</span>
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
                        <Link to={routeLink.ROLES_ADMIN + routePath.LIST}>
                            <Icon type="audit" />
                            <span>Phân quyền</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="13">
                        <Link to={routeLink.ADMIN_ACCOUNTS + routePath.LIST}>
                            <Icon type="key" />
                            <span>Danh sách</span>
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub4"
                    title={
                        <span>
                            <Icon type="security-scan" />
                            <span>Tài khoản</span>
                        </span>
                    }
                >
                    <Menu.Item key="22">
                        <Link to={routeLink.USER_CONTROLLER + routePath.LIST}>
                            <Icon type="user" />
                            <span>Người dùng</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="17">
                        <Link to={routeLink.EM_CONTROLLER + routePath.LIST}>
                            <Icon type="shop" />
                            <span>Nhà tuyển dụng</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="18">
                        <Link to={routeLink.SCHOOLS + routePath.LIST}>
                            <Icon type="share-alt" />
                            <span>Nhà trường</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="19">
                        <Link to={routeLink.STUDENTS + routePath.LIST}>
                            <Icon type="team" />
                            <span>Sinh viên</span>
                        </Link>
                    </Menu.Item>
                    {/* <Menu.Item key="20">
                        <Link to={routeLink.CANDIDATES + routePath.LIST}>
                            <Icon type="idcard" />
                            <span>Ứng viên</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="21">
                        <Link to={routeLink.PARTNER + routePath.LIST}>
                            <Icon type="usergroup-add" />
                            <span>Cộng tác viên</span>
                        </Link>
                    </Menu.Item> */}
                </SubMenu>
            </Menu>
        </Sider>
    )
}

