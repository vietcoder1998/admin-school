import React from 'react';
import ErrorBoundaryRoute from "../../../../../routes/ErrorBoundaryRoute";
import UserControllerList from "./user-controller-list/UserControllerList";

const Switch = require("react-router-dom").Switch;

interface UserControllerProps{
    match: Readonly<any>;
    getListJobNames: Function;
}


export default function UserController(props?: UserControllerProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path}/list`} component={UserControllerList} />
            </Switch>
        </>
    )
}
