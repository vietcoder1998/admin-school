import React, { PureComponent, Fragment } from 'react'
import './DataMgm.scss';
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import { connect } from 'react-redux';
import Languages from './languages/Languages';
import Regions from './regions/Regions';
import Majors from './majors/Majors';
import JobNames from './job-names/JobNames';
import Skills from './skills/Skills';
import TypeSchools from './type-schools/TypeSchools';
import JobGroups from './job-groups/JobGroups';
import Branches from './branches/Branches';
const Switch = require("react-router-dom").Switch;

interface DataMgmState {
    show_menu: boolean;
    to_logout: boolean;
}

interface DataMgmProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class DataMgm extends PureComponent<DataMgmProps, DataMgmState> {
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
                    <ErrorBoundaryRoute  path={`${path}/languages`} component={Languages} />
                    <ErrorBoundaryRoute  path={`${path}/regions`} component={Regions} />
                    <ErrorBoundaryRoute  path={`${path}/majors`} component={Majors} />
                    <ErrorBoundaryRoute  path={`${path}/job-names`} component={JobNames} />
                    <ErrorBoundaryRoute  path={`${path}/skills`} component={Skills} />
                    <ErrorBoundaryRoute  path={`${path}/type-schools`} component={TypeSchools} />
                    <ErrorBoundaryRoute  path={`${path}/job-groups`} component={JobGroups} />
                    <ErrorBoundaryRoute  path={`${path}/branches`} component={Branches} />
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

export default connect(mapStateToProps, mapDispatchToProps)(DataMgm)