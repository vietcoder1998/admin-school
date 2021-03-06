import React from 'react';
import ErrorBoundaryRoute from "../../../../../routes/ErrorBoundaryRoute";
import EmControllerList from './em-controller-list/EmControllerList';

const Switch = require("react-router-dom").Switch;

interface EmployerControllerProps{
    match: Readonly<any>;
    getListJobNames: Function;
}


export default function EmployerController(props?: EmployerControllerProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path}/list`} component={EmControllerList} />
            </Switch>
        </>
    )
}
