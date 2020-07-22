import React, {PureComponent, } from 'react'
import {connect} from 'react-redux';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import CreateWorkingTools from './Create';
import ListWorkingTools from './List';
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

class WorkingTools extends PureComponent<IProps, IState> {
    render() {
        let {path} = this.props.match;
        return (
            <>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateWorkingTools}/>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListWorkingTools}/>
                </Switch>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({});
const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WorkingTools)