import React, { PureComponent } from 'react'
import { Layout, Icon, Avatar, Dropdown, Menu } from 'antd';
import './MngCreate.scss';
import { connect } from 'react-redux';

const Switch = require("react-router-dom").Switch;
const { Content, Header } = Layout;

interface MngCreateState {
}

interface MngCreateProps extends StateProps, DispatchProps {
}

class MngCreate extends PureComponent<MngCreateProps, MngCreateState> {
    constructor(props) {
        super(props);
        this.state = {
         
        }
    }

    async componentDidMount() {
    }

    render() {
        return (
         <div>
             create
         </div>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
})

const mapStateToProps = (state, ownProps) => ({
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MngCreate)