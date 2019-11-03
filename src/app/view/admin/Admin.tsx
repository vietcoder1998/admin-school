import React, { PureComponent } from 'react'
import { Layout, Icon } from 'antd';
import MenuNavigation from './menu-navigation/MenuNavigation';
import './Admin.scss';
import ErrorBoundaryRoute from '../../../routes/ErrorBoundaryRoute';
import Student from './student/Student';
import Friend from './friend/Friend';

const Switch = require("react-router-dom").Switch;
const { Content, Header } = Layout;

interface AdminState {
    show_menu: boolean;
}

interface AdminProps {
    match: Readonly<any>;
}

class Admin extends PureComponent<AdminProps, AdminState> {
    constructor(props) {
        super(props);
        this.state = {
            show_menu: true,
        }
    }

    render() {
        let { show_menu } = this.state;
        let { match } = this.props;
        console.log(this.props);
        return (
            <Layout>
                <MenuNavigation show_menu={show_menu} />
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={show_menu ? 'menu-unfold' : 'menu-fold'}
                            onClick={() => this.setState({ show_menu: !show_menu })}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        <Switch>
                            <ErrorBoundaryRoute path={`${match.url}/student`} component={Student} />
                            <ErrorBoundaryRoute path={`${match.url}/friend`} component={Friend} />
                        </Switch>
                    </Content>
                </Layout>

            </Layout >
        )
    }
}

export default Admin
