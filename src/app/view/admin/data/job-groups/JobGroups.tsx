import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import CreateJobGroups from './create-job-groups/CreateJobGroups';
import ListJobGroups from './list-job-groups/ListJobGroups';

const Switch = require("react-router-dom").Switch;

interface JobGroupsState {
    show_menu: boolean;
    to_logout: boolean;
}

interface JobGroupsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class JobGroups extends PureComponent<JobGroupsProps, JobGroupsState> {

    render() {
        let {path} = this.props.match;
        return (
            <>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateJobGroups}/>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListJobGroups}/>
                </Switch>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JobGroups)