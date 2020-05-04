import React, {  } from 'react'
import ErrorBoundaryRoute from '../../../../../routes/ErrorBoundaryRoute';
import CandidatesList from './candidates-list/PartnerList';
const Switch = require("react-router-dom").Switch;

interface ICandidatesProps {
    match: Readonly<any>;
    getTypeManagement: Function;
}

export default function Candidates(props: ICandidatesProps) {
    let { path } = props.match
    return (
        < >
            <Switch>
                <ErrorBoundaryRoute path={`${path}/list`} component={CandidatesList} />
            </Switch>
        </>
    )
}