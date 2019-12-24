import React, {PureComponent, Fragment} from 'react'
import './Skills.scss';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import {connect} from 'react-redux';
import CreateSkills from './create-skills/CreateSkills';
import ListSkills from './list-skills/ListSkills';

const Switch = require("react-router-dom").Switch;

interface ISkillsState {
    show_menu: boolean;
    to_logout: boolean;
}

interface ISkillsProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getSkills: Function;
    getListTypeManagement: Function;
}

class Skills extends PureComponent<ISkillsProps, ISkillsState> {

    render() {
        let {path} = this.props.match;
        return (
            <Fragment>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateSkills}/>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListSkills}/>
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({});

const mapStateToProps = (state: any, ownProps?: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Skills)