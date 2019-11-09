import React, { PureComponent } from 'react'
import { Layout, Menu, Icon } from 'antd';
import './MenuNavigation.scss';
import logo from '../../../../logo-01.png'
import { Link } from 'react-router-dom';
const { Sider } = Layout;
const { SubMenu } = Menu;

interface MenuNavigationState {
}

interface MenuNavigationProps {
    show_menu: boolean,
}

export default class MenuNavigation extends PureComponent<MenuNavigationProps, MenuNavigationState> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let { show_menu } = this.props;
        let state_bar = '1';
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
                                <span>Ngành nghề</span>
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
                                <Icon type="idcard" />
                                <span>Loại trường</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider >
        )
    }
}

