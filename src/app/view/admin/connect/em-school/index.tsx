import React from 'react';
import ErrorBoundaryRoute from "../../../../../routes/ErrorBoundaryRoute";
import { routePath } from '../../../../../const/break-cumb';
import ConnectEmSchoolList from './List';

const Switch = require("react-router-dom").Switch;

interface IUserProps {
    match: Readonly<any>;
    getListJobNames: Function;
}

export default function EmSchool(props?: IUserProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path + routePath.LIST}`} component={ConnectEmSchoolList} />
            </Switch>
        </>
    )
}
