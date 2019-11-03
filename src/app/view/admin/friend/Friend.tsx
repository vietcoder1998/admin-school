import React, { PureComponent } from 'react'

interface AdminState {

}

interface AdminProps {
    match?: any;
    location?: any;
}

class Friend extends PureComponent<AdminProps, AdminState> {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log(this.props);
        return (
            <p>friend</p>
        )
    }
}

export default Friend