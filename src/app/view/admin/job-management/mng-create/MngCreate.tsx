import React, { PureComponent } from 'react'
import { Icon, Divider, Switch, Button } from 'antd';
import './MngCreate.scss';
import { connect } from 'react-redux';
import CKEditor from 'ckeditor4-react';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { REDUX_SAGA } from '../../../../../common/const/actions';
import { Link } from 'react-router-dom';
import { IAnnouncementDetail } from '../../../../../redux/models/announcement_detail';
import { TYPE } from '../../../../../common/const/type';
import { ICreateNewAnnoucement } from '../../../../../redux/models/announcements';
import { _requestToServer } from '../../../../../services/exec';
import { POST, PUT } from '../../../../../common/const/method';
import { UPLOAD_IMAGE, ANNOUNCEMENT_DETAIL } from '../../../../../services/api/private.api';
import { ADMIN_HOST } from '../../../../../environment/dev';
import { sendImageHeader, authHeaders } from '../../../../../services/auth';

interface MngCreateState {
    title?: string;
    announcementTypeID: string;
    type_management?: Array<any>;
    list_item?: Array<{ label?: string, value?: string }>,
    loading?: boolean;
    fileList?: Array<any>;
    hidden?: boolean;
    content?: string;
    value_annou?: string;
    announcement_detail?: IAnnouncementDetail;
    type_cpn?: string;
    data?: ICreateNewAnnoucement;
    loading_avatar?: boolean;
    imageUrl?: any;
    dataUrl?: any;
    embedUrl?: any;
    loading_content_img?: boolean;
    id?: string;
}

interface MngCreateProps extends StateProps, DispatchProps {
    getTypeManagements: Function;
    getAnnouncementDetail: Function;
    match?: any;
    history?: any;
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
            fileList: [],
            imageUrl: null,
            hidden: false,
            value_annou: "chọn loại bài viết",
            announcement_detail: {
                id: "",
                admin: {},
                viewNumber: 0,
                modifyAdmin: {},
                announcementType: { id: 0, name: "", priority: 0 },
                hidden: false,
                imageUrl: "",
                content: "",
                loading: false,
            },
            type_cpn: TYPE.CREATE,
            loading_avatar: false,
            loading_content_img: false,
            dataUrl: null,
            id: null
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.id && nextProps.match.params.id !== prevState.id) {
            nextProps.getAnnouncementDetail(nextProps.match.params.id)
            return {
                id: nextProps.match.params.id
            }
        }

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

        if (
            nextProps.match.params.id !== "" &&
            nextProps.announcement_detail &&
            nextProps.announcement_detail.id !==
            prevState.announcement_detail.id
        ) {
            let { announcement_detail } = nextProps;
            let fileList = [];
            return {
                title: announcement_detail.title,
                content: announcement_detail.content,
                fileList,
                hidden: announcement_detail.hidden,
                announcement_detail,
                announcementTypeID: announcement_detail.announcementType.id,
                value_annou: announcement_detail.announcementType.name,
                type_cpn: TYPE.EDIT,
                imageUrl: announcement_detail.imageUrl
            }
        }

        if (prevState.announcementTypeID) {
            let { list_item, announcementTypeID } = prevState;
            let value_annou = "";
            list_item.forEach(item => {
                if (item.value === announcementTypeID) {
                    value_annou = item.label
                }
            })

            return {
                value_annou,
            }
        }

        return {
            type_cpn: TYPE.CREATE,
            value_annou: "Chọn loại bài viết",

        }
    }

    async componentDidMount() {
        await this.props.getTypeManagements()
    };

    uploadFileToServer = async (file?: Blob, typeState?: string) => {
        if (typeState === "imageUrl") {
            await this.setState({ imageUrl: "", loading_avatar: true });
        } else {
            await this.setState({ loading_content_img: true })
        }
        await this.setState({})
        let formData = new FormData();
        formData.append("image", file);
        var imageUrl = "";
        await _requestToServer(
            POST,
            formData,
            UPLOAD_IMAGE,
            ADMIN_HOST,
            sendImageHeader,
            null,
            true,
            false
        ).then(res => {
            this.setState({ loading_avatar: false });
            if (res.code === 200) {
                imageUrl = res.data.url;
                if (typeState === "imageUrl") {
                    this.setState({ imageUrl })
                } else {
                    this.addImage(imageUrl);
                }
            }
        })
    }

    addImage = (url: string, style?: any, alt?: string) => {
        let { content } = this.state;
        let defaultStyle = "width: 100%; height: auto; max-width: 1000px";
        let defaultDivStyle = "width: 100%; padding: 5vh 0vh; text-align: center";
        let newImage = `<div style="${defaultDivStyle}"><img style="${style ? style : defaultStyle}" src="${url}" alt="${alt}" /><div>`;
        content = content + newImage;
        this.setState({ content })
    }

    updateAvatarUrl = (imageUrl?: string) => {
        this.setState({ imageUrl })
    }

    createAnnoucement = async () => {
        let {
            title,
            imageUrl,
            announcementTypeID,
            hidden,
            content,
            type_cpn
        } = this.state;
        let data = {
            title,
            imageUrl,
            announcementTypeID,
            hidden,
            content
        }

        await _requestToServer(
            type_cpn === TYPE.CREATE ? POST : PUT,
            data,
            type_cpn === TYPE.CREATE ? ANNOUNCEMENT_DETAIL : ANNOUNCEMENT_DETAIL + `/${this.props.match.params.id}`,
            ADMIN_HOST,
            authHeaders,
            null,
            true
        ).then(res => {
            if (res.code === 200) {
                this.props.history.push('/admin/job-management/list')
            }
        })
    }



    render() {
        let {
            title,
            list_item,
            hidden,
            content,
            value_annou,
            type_cpn,
            loading_avatar,
            imageUrl,
            loading_content_img,
        } = this.state;
        return (
            <React.Fragment>
                <div className='common-content'>
                    <h5>
                        Tạo bài viết mới
                    </h5>
                    <Divider orientation="left" >Nội dung bài viết</Divider>
                    <div className="mng-create-content">
                        <InputTitle
                            type={TYPE.INPUT}
                            value={title}
                            title="Nhập tiêu đề bài viết"
                            placeholder="Tiêu đề"
                            widthLabel="200px"
                            widthInput="400px"
                            onChange={event => this.setState({ title: event })}
                        />
                        <InputTitle
                            type={TYPE.SELECT}
                            title="Chọn loại bài viết"
                            widthLabel="200px"
                            placeholder="Loại bài viết"
                            defaultValue="Loại bài viết"
                            widthSelect="400px"
                            value={value_annou}
                            list_value={list_item}
                            onChange={event => this.setState({ announcementTypeID: event })}
                        />
                        <InputTitle
                            type="SWITCH"
                            title="Ẩn - Hiện"
                            widthLabel="200px"
                        >
                            <Switch checked={!hidden} onClick={() => { this.setState({ hidden: !hidden }) }} />
                            <label style={{ width: "40px", textAlign: "center", fontWeight: 500 }}>
                                {hidden ? "Ẩn" : "Hiện"}
                            </label>
                        </InputTitle>
                        <InputTitle
                            type=""
                            title="Ảnh đại diện"
                            widthLabel="200px"
                        >
                            <React.Fragment>
                                <div className="image-crop-url" style={{ display: imageUrl ? "block" : "none" }}>
                                    <div className="image-cover">
                                        <Icon type="eye" />
                                    </div>
                                    <img id="avatar-announcements" src={imageUrl} alt='ảnh đại diện' />
                                </div>
                                <input
                                    id="avatarUrl"
                                    type="file"
                                    onChange={
                                        (event) => this.uploadFileToServer(event.target.files[0], "imageUrl")
                                    } />
                                <label className='upload-img' htmlFor="avatarUrl">
                                    {!loading_avatar ? <Icon type="plus" /> : <Icon type="loading" style={{ color: "blue" }} />}
                                    <div className="ant-upload-text">Upload</div>
                                </label>
                            </React.Fragment>
                        </InputTitle>

                        <InputTitle
                            title="Nội dung"
                            widthLabel="200px"
                            placeholder="Loại bài viết"
                        >
                            <div className="embed-image">
                                <input
                                    id="imgContent"
                                    type="file"
                                    onChange={
                                        (event) => this.uploadFileToServer(event.target.files[0], "imageContent")
                                    } />
                                <label className='upload-img-content' htmlFor="imgContent">
                                    {!loading_content_img ? <Icon type="upload" /> : <Icon type="loading" style={{ color: "blue" }} />}
                                    Upload
                            </label>
                            </div>
                            <CKEditor
                                id={"yeah"}
                                editorName="editor2"
                                config={{
                                    extraPlugins: 'stylesheetparser',
                                    height: '60vh'
                                }}
                                onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
                                onInit={event => {
                                }}
                                onChange={event => this.setState({ content: event.editor.getData() })}
                                data={content}
                            />
                        </InputTitle>
                    </div>
                    <Divider orientation="left" >Hoàn tất</Divider>
                    <div className="mng-create-content">
                        <Button
                            type="primary"
                            prefix={"check"}
                            style={{
                                margin: "10px 10px",
                                float: "right"
                            }}
                            onClick={this.createAnnoucement}
                        >
                            {type_cpn === TYPE.CREATE ? "Tạo mới" : "Lưu lại"}
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
                                {type_cpn === TYPE.CREATE ? "Hủy bài" : "Hủy sửa"}
                            </Link>
                        </Button>
                    </div>
                </div >
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getTypeManagements: () => dispatch({ type: REDUX_SAGA.TYPE_MANAGEMENT.GET_TYPE_MANAGEMENT }),
    getAnnouncementDetail: (id) => dispatch({ type: REDUX_SAGA.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, id }),
})

const mapStateToProps = (state, ownProps) => ({
    type_management: state.TypeManagement.items,
    announcement_detail: state.AnnouncementDetail.data
})

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(MngCreate)