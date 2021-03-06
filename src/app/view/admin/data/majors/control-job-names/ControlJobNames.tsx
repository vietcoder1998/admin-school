import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
import ErrorBoundaryRoute from '../../../../../../routes/ErrorBoundaryRoute';
import ListMajorJobNames from './list-major-job-names/ListMajorJobNames';
const Switch = require("react-router-dom").Switch;

interface ControlJobNamesState {
    show_menu: boolean;
    to_logout: boolean;
}

interface ControlJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class ControlJobNames extends PureComponent<ControlJobNamesProps, ControlJobNamesState> {

    render() {
        let {path} = this.props.match;
        return (
            <>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListMajorJobNames}/>
                </Switch>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ControlJobNames)