import React, {Suspense, Fragment, lazy} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import FallBack from './FallBack';
import Cookies from 'universal-cookie';

const Route = require("react-router-dom").Route;
const Redirect = require("react-router-dom").Redirect;
const Admin = lazy(() => import('./../app/view/admin/Admin'));
const Login = lazy(() => import('./../app/view/login/Login'));

export default function Routes(props: any) {
    const cookies = new Cookies();
    let is_authen = cookies.get("actk") ? true : false;
    let last_url = localStorage.getItem("last_url");

    return (
        <Fragment>
            <Router>
                <Suspense fallback={<FallBack/>}>
                    <Route path={'/admin'} component={Admin}/>
                </Suspense>
                <Suspense fallback={<FallBack/>}>
                    <Route exact path='/login' component={Login}/> :
                </Suspense>
                <Redirect from='*' to={is_authen ? (last_url ? last_url : "/admin/pending-jobs") : "/login"}/>
            </Router>
        </Fragment>
    );
}
