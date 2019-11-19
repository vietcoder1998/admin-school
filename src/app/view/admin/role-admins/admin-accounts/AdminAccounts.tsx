import React, {PureComponent, Fragment} from 'react'
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import {connect} from 'react-redux';
import ListAdminAccounts from './list-admin-accounts/ListAdminAccounts';
import CreateAdminAccounts from './create-admin-accounts/CreateAdminAccounts';

const Switch = require("react-router-dom").Switch;

interface AdminAccountsState {
    show_menu: boolean;
    to_logout: boolean;
}

interface AdminAccountsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
}

class AdminAccounts extends PureComponent<AdminAccountsProps, AdminAccountsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            show_menu: true,
            to_logout: false,
        }
    }

    render() {
        let {path} = this.props.match;
        return (
            <Fragment>
                <Switch>
                    <ErrorBoundaryRoute path={`${path}/list`} component={ListAdminAccounts}/>
                    <ErrorBoundaryRoute path={`${path}/${'fix'}/:id`} component={CreateAdminAccounts}/>
                    <ErrorBoundaryRoute path={`${path}/${'create'}`} component={CreateAdminAccounts}/>
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AdminAccounts)