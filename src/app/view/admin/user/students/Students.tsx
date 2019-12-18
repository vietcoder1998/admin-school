import React from 'react';
import ErrorBoundaryRoute from "../../../../../routes/ErrorBoundaryRoute";
import StudentsList from './students-list/StudentList';
const Switch = require("react-router-dom").Switch;

interface StudentsProps{
    match: Readonly<any>;
    getListJobNames: Function;
}


export default function Students(props?: StudentsProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path}/list`} component={StudentsList} />
            </Switch>
        </>
    )
}
