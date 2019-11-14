import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
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
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateJobGroups} />
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListJobGroups} />
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

export default connect(mapStateToProps, mapDispatchToProps)(JobGroups)