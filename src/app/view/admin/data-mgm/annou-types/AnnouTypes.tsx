import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import CreateAnnouTypes from './create-annou-types/CreateAnnouTypes';
import ListAnnouTypes from './list-annou-types/ListAnnouTypes';

const Switch = require("react-router-dom").Switch;

interface RegionsState {
    show_menu: boolean;
    to_logout: boolean;
}

interface RegionsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class Regions extends PureComponent<RegionsProps, RegionsState> {

    render() {
        let {path} = this.props.match;
        return (
            <Fragment>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateAnnouTypes}/>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListAnnouTypes}/>
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Regions)