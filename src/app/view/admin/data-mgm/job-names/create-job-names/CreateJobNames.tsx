import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';

interface CreateJobNamesState {
    show_menu: boolean;
    to_logout: boolean;
}

interface CreateJobNamesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getJobNames: Function;
    getTypeManagement: Function;
}

class CreateJobNames extends PureComponent<CreateJobNamesProps, CreateJobNamesState> {
    constructor(props) {
        super(props);
        this.state = {
            show_menu: true,
            to_logout: false,
        }
    }

    render() {
        return (
            <Fragment >
                <div>
                    <h5>Thêm công việc mới</h5>
                </div>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({

})

const mapStateToProps = (state, ownProps) => ({
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateJobNames)