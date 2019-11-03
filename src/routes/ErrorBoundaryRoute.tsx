import React from 'react';
import ErrorBoundary from './ErrorBoundary';
const Route = require("react-router-dom").Route;

export const ErrorBoundaryRoute = ({ component: Component, ...rest }) => {
    const encloseInErrorBoundary = props => (
        <ErrorBoundary>
            <Component {...props} />
        </ErrorBoundary>
    );

    if (!Component) throw new Error(`A component needs to be specified for path ${(rest as any).path}`);

    return <Route {...rest} render={encloseInErrorBoundary} />;
};

export default ErrorBoundaryRoute;
