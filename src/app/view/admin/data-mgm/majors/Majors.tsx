import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import CreateMajors from './create-majors/CreateMajors';
import ListMajors from './list-majors/ListMajors';
import ControlJobNames from './control-job-names/ControlJobNames';
const Switch = require("react-router-dom").Switch;

interface MajorsState {
    show_menu: boolean;
    to_logout: boolean;
}

interface MajorsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class Majors extends PureComponent<MajorsProps, MajorsState> {

    render() {
        let {path} = this.props.match;
        return (
            <Fragment>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateMajors}/>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListMajors}/>
                    <ErrorBoundaryRoute path={`${path}/:id/job-names`} component={ControlJobNames}/>
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Majors)