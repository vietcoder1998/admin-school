import React, {PureComponent, Fragment} from 'react'
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import {connect} from 'react-redux';
import ListAdminAccounts from './list-admin-accounts/ListAdminAccounts';
import CreateAdminAccounts from './create-admin-accounts/CreateAdminAccounts';
import { routePath } from '../../../../../const/break-cumb';

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

    render() {
        let {path} = this.props.match;
        return (
            <Fragment>
                <Switch>
                    <ErrorBoundaryRoute path={`${path}${routePath.LIST}`} component={ListAdminAccounts}/>
                    <ErrorBoundaryRoute path={`${path}${routePath.FIX}/:id`} component={CreateAdminAccounts}/>
                    <ErrorBoundaryRoute path={`${path}${routePath.CREATE}`} component={CreateAdminAccounts}/>
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AdminAccounts)