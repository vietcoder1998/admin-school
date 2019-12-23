import React, { Fragment } from 'react'
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import CandidatesList from './candidates-list/CandidatesList';
const Switch = require("react-router-dom").Switch;

interface ICandidatesProps {
    match: Readonly<any>;
    getTypeManagement: Function;
}

export default function Candidates(props: ICandidatesProps) {
    let { path } = props.match
    return (
        <Fragment >
            <Switch>
                <ErrorBoundaryRoute path={`${path}/list`} component={CandidatesList} />
            </Switch>
        </Fragment>
    )
}