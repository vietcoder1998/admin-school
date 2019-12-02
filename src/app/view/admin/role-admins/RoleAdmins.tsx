import React, {PureComponent, Fragment} from 'react'
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import {connect} from 'react-redux';
import Roles from './roles/Roles';
import AdminAccounts from './admin-accounts/AdminAccounts';

const Switch = require("react-router-dom").Switch;

interface RoleAdminsState {
    show_menu: boolean;
    to_logout: boolean;
}

interface RoleAdminsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
}

class RoleAdmins extends PureComponent<RoleAdminsProps, RoleAdminsState> {

    render() {
        let {path} = this.props.match;
        return (
            <Fragment>
                <Switch>
                    <ErrorBoundaryRoute path={`${path}/roles`} component={Roles}/>
                    <ErrorBoundaryRoute path={`${path}/admin-accounts`} component={AdminAccounts}/>
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RoleAdmins)