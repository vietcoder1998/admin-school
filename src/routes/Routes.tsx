import React, { Suspense, Fragment, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import FallBack from './FallBack';
import Cookies from 'universal-cookie';

const Route = require("react-router-dom").Route;
const Redirect = require("react-router-dom").Redirect;
const Admin = lazy(() => import('./../app/view/admin/Admin'));
const Login = lazy(() => import('./../app/view/login/Login'));

export default function Routes(props) {
  const cookies = new Cookies();
  let is_authen = cookies.get("actk") ? true : false;
  return (
    <Fragment>
      <Router>
        <Suspense fallback={<FallBack />}>
          <Route exact path="/login" component={Login} />
        </Suspense>
        <Suspense fallback={<FallBack />}>
          {is_authen ? <Route is_authen={is_authen} path="/admin" component={Admin} /> : <Redirect to={'/login'} /> }
        </Suspense>
      </Router>
    </Fragment >
  );
}
