import React from "react";
interface IErrorBoundaryProps {
    children: any;
}

interface IErrorBoundaryState {
    error?: any;
    errorInfo?: any;
}

class ErrorBoundary extends React.PureComponent<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
    }

    render() {
        let { errorInfo, error } = this.state;
        let { children } = this.props;
        if (errorInfo) {
            // Error path
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {error && error.toString()}
                        <br />
                        {errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        // Normally, just render children
        return children;
    }
}

export default ErrorBoundary;