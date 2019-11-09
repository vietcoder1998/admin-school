import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';

interface CreateLanguagesState {
    show_menu: boolean;
    to_logout: boolean;
}

interface CreateLanguagesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    getJobNames: Function;
    getTypeManagement: Function;
}

class CreateLanguages extends PureComponent<CreateLanguagesProps, CreateLanguagesState> {
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
                    <h5>Thêm ngôn ngữ mới</h5>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateLanguages)