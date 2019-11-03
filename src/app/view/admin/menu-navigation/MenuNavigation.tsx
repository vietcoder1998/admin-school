import React, { PureComponent } from 'react'
import { Layout, Menu, Icon } from 'antd';
import './MenuNavigation.scss';
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
        return (
            <Sider trigger={null} collapsible collapsed={show_menu}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" >
                        <Link to='/admin/pending-jobs' >
                            <Icon type="hourglass" />
                            <span>Bài đăng đang chờ</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to='/admin/job-management' >
                            <Icon type="book" />
                            <span>Quản lí bài đăng</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Icon type="upload" />
                        <span>nav 3</span>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="user" />
                                <span>User</span>
                            </span>
                        }
                    >
                        <Menu.Item key="7">Tom</Menu.Item>
                        <Menu.Item key="8">Bill</Menu.Item>
                        <Menu.Item key="9">Alex</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

