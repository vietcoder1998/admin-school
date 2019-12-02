import React, {PureComponent, Fragment} from 'react'
import './TypeSchools.scss';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import {connect} from 'react-redux';
import CreateTypeSchools from './create-type-schools/CreateTypeSchools';
import ListTypeSchools from './list-type-schools/ListTypeSchools';

const Switch = require("react-router-dom").Switch;

interface ITypeSchoolsState {
    show_menu: boolean;
    to_logout: boolean;
}

interface ITypeSchoolsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getTypeSchools: Function;
    getListTypeManagement: Function;
}

class TypeSchools extends PureComponent<ITypeSchoolsProps, ITypeSchoolsState> {

    render() {
        let {path} = this.props.match;
        return (
            <Fragment>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateTypeSchools}/>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListTypeSchools}/>
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypeSchools)