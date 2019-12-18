import React from 'react';
import ErrorBoundaryRoute from "../../../../../routes/ErrorBoundaryRoute";
import SchoolsList from './schools-controller-list/SchoolsList';
const Switch = require("react-router-dom").Switch;

interface SchoolsProps{
    match: Readonly<any>;
    getListJobNames: Function;
}


export default function Schools(props?: SchoolsProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path}/list`} component={SchoolsList} />
            </Switch>
        </>
    )
}
