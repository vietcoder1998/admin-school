import React from 'react';
import ErrorBoundaryRoute from "../../../../routes/ErrorBoundaryRoute";
import UserController from './user-controller/UserController';
import { routePath } from '../../../../common/const/break-cumb';
import EmployerController from './em-controller/EmController';
import EmBranches from './em-branches/EmBranches';

const Switch = require("react-router-dom").Switch;

interface IUserProps{
    match: Readonly<any>;
    getListJobNames: Function;
}


export default function User(props?: IUserProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path}${routePath.USER_CONTROLLER}`} component={UserController} />
                <ErrorBoundaryRoute path={`${path}${routePath.EM_CONTROLLER}`} component={EmployerController} />
                <ErrorBoundaryRoute path={`${path}${routePath.EM_BRANCHES}`} component={EmBranches} />
            </Switch>
        </>
    )
}
