import React from 'react';
import ErrorBoundaryRoute from "../../../../routes/ErrorBoundaryRoute";
import { routePath } from '../../../../const/break-cumb';
import EmSchool from "./em-school/index";

const Switch = require("react-router-dom").Switch;

interface IUserProps {
    match: Readonly<any>;
    getListJobNames: Function;
}


export default function Connect(props?: IUserProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path + routePath.EM_SCHOOL}`} component={EmSchool} />
            </Switch>
        </>
    )
}
