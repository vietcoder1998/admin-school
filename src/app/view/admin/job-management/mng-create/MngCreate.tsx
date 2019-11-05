import React, { PureComponent } from 'react'
import { Layout, Icon, Avatar, Dropdown, Menu, Divider } from 'antd';
import './MngCreate.scss';
import { connect } from 'react-redux';
import CKEditor from 'ckeditor4-react';

const Switch = require("react-router-dom").Switch;

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
            <div className='common-content'>
                <h5>
                    Tạo bài viết mới
                </h5>
                <div>
                    <Divider orientation="left" >Nội dung bài viết</Divider>
                    <CKEditor
                        id={"yeah"}
                        editorName="editor2"
                        config={{
                            extraPlugins: 'stylesheetparser'
                        }}
                        onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
                        onInit={event => {
                            console.log(event);
                        }} fa-address-book
                        data="<p>Hello from CKEditor 4!</p>"
                    />
                </div>
                <div>
                    <Divider orientation="right" >Thêm ảnh</Divider>
                </div>
                <div></div>
                <div></div>


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