import React, { PureComponent, Fragment } from 'react'
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import { connect } from 'react-redux';
import ListRoles from './list-roles/ListRoles';
import CreateRoles from './create-roles/CreateRoles';
const Switch = require("react-router-dom").Switch;

interface RolesState {
    show_menu: boolean;
    to_logout: boolean;
}

interface RolesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
}

class Roles extends PureComponent<RolesProps, RolesState> {
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
                    <ErrorBoundaryRoute  path={`${path}/list`} component={ListRoles} />
                    <ErrorBoundaryRoute  path={`${path}/${'fix'}/:id`} component={CreateRoles} />
                    <ErrorBoundaryRoute  path={`${path}/${'create'}`} component={CreateRoles} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Roles)