import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import FallBack from './FallBack';

const Route = require("react-router-dom").Route;
const Admin = lazy(() => import('./../app/view/admin/Admin'));
const Login = lazy(() => import('./../app/view/login/Login'));
const NotFound = lazy(() => import('./../app/view/not-found/NotFound'));

let tk = localStorage.getItem("token");

export default function Routes(props: any) {
    return (
        <>
            <Router>
                <Suspense fallback={<FallBack />}>
                    <Route path={'/admin'} component={Admin} />
                </Suspense>
                <Suspense fallback={<FallBack />}>
                    <Route exact path='/login' component={tk ? Admin :  Login} /> 
                </Suspense>
                <Suspense fallback={<FallBack />}>
                    <Route exact path='/' component={tk ? Admin :  Login} /> 
                </Suspense>
                <Suspense fallback={<FallBack />}>
                    <Route exact path='*' component={NotFound} /> 
                </Suspense>
            </Router>
        </>
    );
}
