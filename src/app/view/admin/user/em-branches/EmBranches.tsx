import React from 'react';
import ErrorBoundaryRoute from "../../../../../routes/ErrorBoundaryRoute";
import EmBranchesList from './em-branches-list/EmBranchesList';

const Switch = require("react-router-dom").Switch;

interface IEmBranchesProps{
    match: Readonly<any>;
    getListJobNames: Function;
}


export default function EmBranches(props?: IEmBranchesProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path}/list/:id`} component={EmBranchesList} />
            </Switch>
        </>
    )
}
