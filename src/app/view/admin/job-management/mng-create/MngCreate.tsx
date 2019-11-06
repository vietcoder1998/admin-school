import React, { PureComponent } from 'react'
import { Upload, Modal, Icon, Divider } from 'antd';
import './MngCreate.scss';
import { connect } from 'react-redux';
import CKEditor from 'ckeditor4-react';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { REDUX_SAGA } from '../../../../../common/const/actions';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// function beforeUpload(file) {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isJpgOrPng) {
//         message.error('You can only upload JPG/PNG file!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//         message.error('Image must smaller than 2MB!');
//     }
//     return isJpgOrPng && isLt2M;
// }

const Switch = require("react-router-dom").Switch;

interface MngCreateState {
    header_title?: string;
    announcementTypeID: string;
    type_management?: Array<any>;
    list_item?: Array<{ label?: string, value?: string }>,
    loading?: boolean;
    previewImage?: any;
    previewVisible?: boolean;
    fileList?: Array<any>;
}

interface MngCreateProps extends StateProps, DispatchProps {
    getTypeManagements: Function
}

class MngCreate extends PureComponent<MngCreateProps, MngCreateState> {
    constructor(props) {
        super(props);
        this.state = {
            header_title: "",
            announcementTypeID: "",
            type_management: [],
            list_item: [],
            loading: false,
            previewImage: null,
            previewVisible: false,
            fileList: []
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.type_management !== prevState.type_management) {
            let list_item = [];
            for (let i = 0; i < nextProps.type_management.length; i++) {
                const element = nextProps.type_management[i];
                const list_target = element.targets;
                console.log(list_target);
                let target = "";

                if (list_target.length === 0) {
                    target = "Mọi đối tượng";
                } else {
                    list_target.forEach((element, index) => {
                        target += element + (index !== list_target.length - 1 ? ', ' : "")
                    });
                }
                list_item.push({ label: element.name + ` ( ${target} ) `, value: element.id });
            }

            return {
                list_item,
                type_management: nextProps.type_management
            }
        } return null
    }

    async componentDidMount() {
        await this.props.getTypeManagements()
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });

    render() {
        let { header_title, list_item, fileList , previewImage, previewVisible} = this.state;

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className='common-content'>
                <h5>
                    Tạo bài viết mới
                </h5>
                <div className="mng-create-content">
                    <Divider orientation="left" >Nội dung bài viết</Divider>
                    <InputTitle
                        value={header_title}
                        title="Nhập tiêu đề bài viết"
                        widthLabel="200px"
                        onChange={event => this.setState({ header_title: event })}
                    />
                    <InputTitle
                        type="SELECT"
                        title="Chọn loại bài viết"
                        widthLabel="200px"
                        placeholder="Loại bài viết"
                        widthComponent="400px"
                        list_value={list_item}
                        onChange={event => this.setState({ announcementTypeID: event })}
                    />

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
                <div className="mng-create-content">
                    <Divider orientation="left" >Thêm ảnh</Divider>
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%', height: "80vh" }} src={previewImage} />
                </Modal>
            </div >
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getTypeManagements: () => dispatch({ type: REDUX_SAGA.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT })
})

const mapStateToProps = (state, ownProps) => ({
    type_management: state.TypeManagement.items
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MngCreate)