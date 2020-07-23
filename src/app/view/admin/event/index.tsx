import React, { PureComponent } from 'react'
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import { connect } from 'react-redux';
import EventJobsList from './event-jobs-list/EventJobsList';
import EventSchoolsList from './event-school-list/EventSchoolList';
import { routePath } from '../../../../const/break-cumb';
import EventCreate from './event-create/EventCreate';
import EventJobCreate from './event-jobs-create/EventJobsCreate';
import EventEmList from './event-em-list/EventEmList';
const Switch = require("react-router-dom").Switch;

interface IState {
    show_menu: boolean;
    to_logout: boolean;
}

interface IProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class Announcement extends PureComponent<IProps, IState> {
    render() {
        let {path} = this.props.match;
        return (
            < >
                <Switch>
                    <ErrorBoundaryRoute exact path={path + routePath.LIST} component={EventSchoolsList} />
                    <ErrorBoundaryRoute exact path={path + routePath.JOBS + routePath.LIST  } component={EventJobsList} />
                    <ErrorBoundaryRoute exact path={path + routePath.JOBS + routePath.CREATE } component={EventJobCreate} />
                    <ErrorBoundaryRoute exact path={path + routePath.JOBS + routePath.COPY + `/:id`} component={EventJobCreate} />
                    <ErrorBoundaryRoute exact path={path + routePath.JOBS + routePath.FIX + `/:id`} component={EventJobCreate} />
                    <ErrorBoundaryRoute exact path={path + routePath.EMPLOYER +  routePath.LIST } component={EventEmList} />
                    <ErrorBoundaryRoute exact path={path + routePath.CREATE} component={EventCreate} />
                    <ErrorBoundaryRoute exact path={path + routePath.FIX + `/:eid`} component={EventCreate} />
                </Switch>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({

});

const mapStateToProps = (state: any, ownProps?: any) => ({
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Announcement)