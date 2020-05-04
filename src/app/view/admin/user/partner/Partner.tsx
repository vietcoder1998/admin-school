import React from 'react';
import ErrorBoundaryRoute from "../../../../../routes/ErrorBoundaryRoute";
import PartnerList from './partner-list/PartnerList';
import CreatePartnerAccounts from './create-partner-accounts/CreatePartnerAccounts';
const Switch = require("react-router-dom").Switch;

interface PartnerProps{
    match: Readonly<any>;
    getListJobNames: Function;
}


export default function Partner(props?: PartnerProps) {
    let { path } = props.match;
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${path}/list`} component={PartnerList} />
                <ErrorBoundaryRoute path={`${path}/create`} component={CreatePartnerAccounts} />
            </Switch>
        </>
    )
}
