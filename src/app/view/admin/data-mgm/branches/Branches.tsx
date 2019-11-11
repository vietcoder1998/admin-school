import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import ListBranches from './list-branches/ListBranches';
import CreateBranches from './create-branches/CreateBranches';

const Switch = require("react-router-dom").Switch;

interface BranchesState {
    show_menu: boolean;
    to_logout: boolean;
}

interface BranchesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getBranches: Function;
    getTypeManagement: Function;
}

class Branches extends PureComponent<BranchesProps, BranchesState> {
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
                    <ErrorBoundaryRoute exact path={`${path}/create`} component={CreateBranches} />
                    <ErrorBoundaryRoute exact path={`${path}/list`} component={ListBranches} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Branches)