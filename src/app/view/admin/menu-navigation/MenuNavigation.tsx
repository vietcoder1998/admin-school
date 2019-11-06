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
                        <Link to='/admin/job-management/list' >
                            <Icon type="book" />
                            <span>Quản lí bài viết</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <Link to={'/admin/data'}>
                                <Icon type="user" />
                                <span>Kĩ năng</span>
                            </Link>
                        }
                    >
                        <Menu.Item key="7">
                            <Link to={'/admin/data'}>
                                <Icon type="user" />
                                <span>Ngôn ngữ</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="8">
                            <Link to={'/admin/data'}>
                                <Icon type="user" />
                                <span>Ngành nghề</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="9">
                            <Link to={'/admin/data'}>
                                <Icon type="user" />
                                <span>Tỉnh thành</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="10">
                            <Link to={'/admin/data'}>
                                <Icon type="user" />
                                <span>Loại công việc</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}

