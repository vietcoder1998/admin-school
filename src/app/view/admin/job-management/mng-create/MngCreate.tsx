import React, { PureComponent } from 'react'
import { Upload, Modal, Icon, Divider, Switch, Row, Col, Button } from 'antd';
import './MngCreate.scss';
import { connect } from 'react-redux';
import CKEditor from 'ckeditor4-react';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { REDUX_SAGA } from '../../../../../common/const/actions';
import { Link } from 'react-router-dom';

interface MngCreateState {
    title?: string;
    announcementTypeID: string;
    type_management?: Array<any>;
    list_item?: Array<{ label?: string, value?: string }>,
    loading?: boolean;
    previewImage?: any;
    previewVisible?: boolean;
    fileList?: Array<any>;
    hidden?: boolean;
    content?: string;
}

interface MngCreateProps extends StateProps, DispatchProps {
    getTypeManagements: Function;
    getAnnouncementDetail: Function;
    match?: any;
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class MngCreate extends PureComponent<MngCreateProps, MngCreateState> {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            announcementTypeID: "",
            type_management: [],
            list_item: [],
            loading: false,
            previewImage: null,
            previewVisible: false,
            fileList: [],
            hidden: false,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.type_management !== prevState.type_management) {
            let list_item = [];
            for (let i = 0; i < nextProps.type_management.length; i++) {
                const element = nextProps.type_management[i];
                const list_target = element.targets;
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
        }

        if (nextProps.announcement_detail || nextProps.match.params.id) {
            let { announcement_detail } = nextProps;
            let fileList = [];
            fileList.push({
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: announcement_detail.imageUrl,
            });

            return {
                title: announcement_detail.title,
                content: announcement_detail.content,
                fileList
            }
        }

        return null
    }

    async componentDidMount() {
        await this.props.getTypeManagements()
        if (this.props.match.params.id) {
            let id = this.props.match.params.id;
            await this.props.getAnnouncementDetail(id);
        }
    };


    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

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

    handleChange = async ({ fileList }) => {
        await this.setState({ fileList, previewImage: true });
    };

    createRequest = async () => {
        // let { fileList, hidden, title, announcementTypeID } = this.state;
    }

    render() {
        let { title, list_item, previewImage, previewVisible, hidden, content, fileList } = this.state;
        console.log(this.props);

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
                <Divider orientation="left" >Nội dung bài viết</Divider>
                <div className="mng-create-content">
                    <InputTitle
                        value={title}
                        title="Nhập tiêu đề bài viết"
                        placeholder="Tiêu đề"
                        widthLabel="200px"
                        onChange={event => this.setState({ title: event })}
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

                    <InputTitle
                        title="Nội dung"
                        widthLabel="200px"
                        placeholder="Loại bài viết"
                    >
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
                            data={content}
                        />
                    </InputTitle>


                </div>
                <Row>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Divider orientation="left" >Thêm ảnh</Divider>
                        <div className="mng-create-content">
                            <Upload
                                action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                listType="picture-card"
                                onChange={this.handleChange}
                                onPreview={this.handlePreview}
                                defaultFileList={fileList}
                            >
                                {uploadButton}
                            </Upload>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Divider orientation="left" >Trạng thái</Divider>
                        <div className="mng-create-content">
                            <div className="avatar-load">
                                <Switch defaultChecked={true} onChange={(event) => { console.log(hidden); this.setState({ hidden: !event }) }} />
                                <label style={{ width: "40px", textAlign: "center", fontWeight: 500 }}>
                                    {hidden ? "Ẩn" : "Hiện"}
                                </label>
                            </div>
                        </div>
                    </Col>

                </Row>
                <Divider orientation="left" >Hoàn tất</Divider>
                <div className="mng-create-content">
                    <Button
                        type="primary"
                        prefix={"check"}
                        style={{
                            margin: "10px 10px",
                            float: "right"
                        }}
                    >
                        Tạo mới
                            <Icon type="right" />
                    </Button>
                    <Button
                        type="danger"
                        prefix={"check"}
                        style={{
                            margin: "10px 10px",
                            float: "right"
                        }}
                    >
                        <Link to='/admin/job-management/list'>
                            <Icon type="close" />
                            Hủy bài
                        </Link>
                    </Button>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%', height: "80vh" }} src={previewImage} />
                </Modal>
            </div >
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getTypeManagements: () => dispatch({ type: REDUX_SAGA.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT }),
    getAnnouncementDetail: (path) => dispatch({ type: REDUX_SAGA.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, path }),
})

const mapStateToProps = (state, ownProps) => ({
    type_management: state.TypeManagement.items,
    announcement_detail: state.AnnouncementDetail.data
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MngCreate)