import React, { PureComponent } from 'react'

interface AdminState {

}

interface AdminProps {
    match?: any
}

class Student extends PureComponent<AdminProps, AdminState> {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log(this.props);
        return (
            <p>student</p>
        )
    }
}

export default Student