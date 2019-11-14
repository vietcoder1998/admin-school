import React, { PureComponent, Fragment } from 'react'
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import { connect } from 'react-redux';
import Roles from './roles/Roles';
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
    constructor(props) {
        super(props);
        this.state = {
            show_menu: true,
            to_logout: false,
        }
    }

    render() {
       let {path} = this.props.match
        return (
            <Fragment >
                <Switch>
                    <ErrorBoundaryRoute  path={`${path}/roles`} component={Roles} />
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
})

const mapStateToProps = (state, ownProps) => ({
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(RoleAdmins)