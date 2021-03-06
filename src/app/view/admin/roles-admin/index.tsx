import React from 'react'
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import { connect } from 'react-redux';
import Roles from './roles/Roles';
import AdminAccounts from './admin-accounts/AdminAccounts';
import { routePath } from '../../../../const/break-cumb';

const Switch = require("react-router-dom").Switch;

interface RoleAdminsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
}

function RoleAdmins(props?: RoleAdminsProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path}${routePath.ROLES_ADMIN}`} component={Roles} />
                <ErrorBoundaryRoute path={`${path}${routePath.ADMIN_ACCOUNTS}`} component={AdminAccounts} />
            </Switch>
        </>
    )
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({});
const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RoleAdmins)