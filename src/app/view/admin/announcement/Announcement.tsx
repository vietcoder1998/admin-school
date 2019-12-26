import React, { PureComponent,  } from 'react'
import './Announcement.scss';
import ErrorBoundaryRoute from '../../../../routes/ErrorBoundaryRoute';
import { connect } from 'react-redux';
import AnnouncementList from './announcement-list/AnnouncementList';
import AnnouncementCreate from './announcement-create/AnnouncementCreate';
const Switch = require("react-router-dom").Switch;

interface AnnouncementState {
    show_menu: boolean;
    to_logout: boolean;
}

interface AnnouncementProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class Announcement extends PureComponent<AnnouncementProps, AnnouncementState> {
    render() {
        let {path} = this.props.match;
        return (
            < >
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={AnnouncementList} />
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={AnnouncementCreate} />
                    <ErrorBoundaryRoute exact path={`${path}/fix/:id`} component={AnnouncementCreate} />
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