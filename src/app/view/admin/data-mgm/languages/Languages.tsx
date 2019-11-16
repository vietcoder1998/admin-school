import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import CreateLanguages from './create-languages/CreateLanguages';
import ListLanguages from './list-languages/ListLanguages';

const Switch = require("react-router-dom").Switch;

interface LanguagesState {
    show_menu: boolean;
    to_logout: boolean;
}

interface LanguagesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getListJobNames: Function;
    getListTypeManagement: Function;
}

class Languages extends PureComponent<LanguagesProps, LanguagesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            show_menu: true,
            to_logout: false,
        }
    }

    render() {
        let {path} = this.props.match;
        return (
            <Fragment>
                <Switch>
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateLanguages}/>
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListLanguages}/>
                </Switch>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Languages)