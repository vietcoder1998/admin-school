import React, { PureComponent } from 'react'
import { Icon, Divider, Switch, Button, message } from 'antd';
import './AnnouncementCreate.scss';
import { connect } from 'react-redux';
import CKEditor from 'ckeditor4-react';
import { InputTitle } from '../../../layout/input-tittle/InputTitle';
import { REDUX_SAGA } from '../../../../../const/actions';
import { Link } from 'react-router-dom';
import { IAnnouncementDetail } from '../../../../../redux/models/announcement_detail';
import { TYPE } from '../../../../../const/type';
import { ICreateNewAnnoucement } from '../../../../../redux/models/announcements';
import { _requestToServer } from '../../../../../services/exec';
import { POST, PUT } from '../../../../../const/method';
import { UPLOAD_IMAGE, ANNOUNCEMENT_DETAIL } from '../../../../../services/api/private.api';
import { sendImageHeader } from '../../../../../services/auth';
import { IAnnouType } from '../../../../../redux/models/annou-types';

interface IAnnouncementCreateState {
    title?: string;
    announcementTypeID: number;
    list_anno_type?: Array<any>;
    list_item?: Array<{ label?: string, value?: string }>,
    loading?: boolean;
    fileList?: Array<any>;
    hidden?: boolean;
    content?: string;
    value_annou?: string;
    previewContent?: string;
    announcement_detail?: IAnnouncementDetail;
    type_cpn?: string;
    data?: ICreateNewAnnoucement;
    loading_avatar?: boolean;
    imageUrl?: string;
    dataUrl?: any;
    embedUrl?: any;
    loading_content_img?: boolean;
    id?: string;
    loading_rq?: boolean;
}

interface IAnnouncementCreateProps extends StateProps, DispatchProps {
    match?: any;
    history?: any;
    location?: any;
    getTypeManagements: Function;
    getAnnouncementDetail: Function;
}

class AnnouncementCreate extends PureComponent<IAnnouncementCreateProps, IAnnouncementCreateState> {
    constructor(props: any) {
        super(props);
        this.state = {
            title: null,
            announcementTypeID: null,
            list_anno_type: [],
            list_item: [],
            loading: false,
            fileList: [],
            imageUrl: undefined,
            hidden: false,
            value_annou: "Chọn loại bài viết",
            announcement_detail: {
                id: "",
                admin: {},
                previewContent: null,
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
            id: undefined,
            loading_rq: false
        }
    }

    static getDerivedStateFromProps(nextProps?: IAnnouncementCreateProps, prevState?: IAnnouncementCreateState) {
        if (nextProps.match.params.id && nextProps.match.params.id !== prevState.id) {
            return {
                id: nextProps.match.params.id,
                type_cpn: TYPE.EDIT
            }
        }

        if (
            nextProps.match.params.id && nextProps.announcement_detail &&
            nextProps.announcement_detail !== prevState.announcement_detail
        ) {
            let { announcement_detail } = nextProps;
            let fileList: any = [];
            return {
                title: announcement_detail.title,
                content: announcement_detail.content,
                fileList,
                hidden: announcement_detail.hidden,
                announcement_detail,
                announcementTypeID: announcement_detail.announcementType.id,
                value_annou: announcement_detail.announcementType.name,
                imageUrl: announcement_detail.imageUrl,
                previewContent: announcement_detail.previewContent
            }
        }

        if (nextProps.list_anno_type) {
            let { list_anno_type } = nextProps;
            let list_item = [];
            list_anno_type.forEach((item: IAnnouType, index: number) => {
                const list_target = item.targets;
                let target = "";

                if (list_target.length === 0) {
                    target = "Mọi đối tượng";
                } else {
                    list_target.forEach((element: any, index: number) => {
                        target += element + (index !== list_target.length - 1 ? ', ' : "")
                    });
                }
                list_item.push({ label: item.name + ` ( ${target} ) `, value: item.id });
            });

            return {
                list_item
            }
        }

        return {
            type_cpn: TYPE.CREATE,
            value_annou: "Chọn loại bài viết",
        };
    };

    async componentDidMount() {
        await this.props.getTypeManagements()
        if (this.props.match.params.id) {
            await this.props.getAnnouncementDetail(this.props.match.params.id)
        }
    };


    uploadFileToServer = async (file?: Blob, typeState?: string) => {
        if (!file) {
            return;
        }
        if (typeState === "imageUrl") {
            await this.setState({ imageUrl: "", loading_avatar: true });
        } else {
            await this.setState({ loading_content_img: true })
        }
        let formData = new FormData();
        formData.append("image", file);
        var imageUrl = "";
        await _requestToServer(
            POST, UPLOAD_IMAGE,
            formData,
            sendImageHeader
        ).then((res: any) => {
            this.setState({ loading_avatar: false });
            if (res) {
                imageUrl = res.data.url;
                if (typeState === "imageUrl") {
                    this.setState({ imageUrl })
                } else {
                    this.addImage(imageUrl);
                }
            }
        });
        await this.setState({ loading_content_img: false, loading_avatar: false })
    };

    addImage = (url: string) => {
        this.addText(url);
    };


    addText = async (text: any) => {
        let sel, range;
        let image = document.createElement('img');
        let p = document.createElement('p');
        let div = document.createElement('div')

        image.src = text;
        image.style.width = '100%';
        image.style.height = '100%';
        image.style.maxHeight = '100%';
        image.style.margin = '0.5vw 0px';

        p.innerHTML = 'Chú thích ảnh';
        p.style.fontStyle = 'italic';
        p.style.width = '100%';
        p.style.textAlign = 'center';

        div.innerHTML = 'Nhập tiếp ...'

        try {
            let newWindow = document.getElementsByTagName('iframe')[0].contentWindow;

            if (newWindow.getSelection()) {
                sel = newWindow.getSelection();
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    range.deleteContents();
                    await range.insertNode(div)
                    await range.insertNode(p);
                    await range.insertNode(image);
                }
            }
            newWindow.focus();
        } catch (err) {
            throw err
        }

    }

    updateAvatarUrl = (imageUrl?: string) => {
        this.setState({ imageUrl })
    };

    choseAnou = (announcementTypeID?: number) => {
        let { list_item, value_annou } = this.state;
        list_item.forEach((item: any) => {
            if (item.value === announcementTypeID) {
                value_annou = item.label
            }
        });

        return this.setState({ value_annou, announcementTypeID })
    };

    createAnnoucement = async () => {
        let {
            title,
            imageUrl,
            announcementTypeID,
            hidden,
            content,
            type_cpn,
            previewContent
        } = this.state;

        await this.setState({ loading_rq: true })


        if (!title) {
            message.warning("Bài đăng chưa có tiêu đề", 2)
        }

        if (!imageUrl) {
            message.warning("Bài đăng chưa có ảnh đại diện", 2)
        }

        if (!announcementTypeID) {
            message.warning("Bài đăng chưa chọn loại bài viết", 2)
        }

        if (!content) {
            message.warning("Bài đăng chưa có nội dung", 2)
        }

        if (title && imageUrl && announcementTypeID && content) {
            let newContent = `<div style="text-align: justify;">${content}</div> `;
            await _requestToServer(
                type_cpn === TYPE.CREATE ? POST : PUT,
                type_cpn === TYPE.CREATE ? ANNOUNCEMENT_DETAIL : ANNOUNCEMENT_DETAIL + `/${this.props.match.params.id}`,
                {
                    title,
                    imageUrl,
                    announcementTypeID,
                    hidden,
                    content: newContent,
                    previewContent
                }
            ).then((res: any) => {
                if (res) {
                    setTimeout(() => {
                        this.props.history.push('/admin/job-management/list')
                    }, 500);

                };
            }).finally(() => {
                this.setState({ loading_rq: false })
            })
        }


    };

    componentWillUnmount() {
        window.removeEventListener("focus", () => {
            console.log("ok")
        })

    }

    render() {
        let {
            title,
            hidden,
            content,
            type_cpn,
            loading_avatar,
            imageUrl,
            loading_content_img,
            value_annou,
            list_item,
            loading_rq,
            previewContent
        } = this.state;

        return (
            <>
                <div className='common-content'>
                    <h5>
                        Tạo bài viết mới
                    </h5>
                    <Divider orientation="left">Nội dung bài viết</Divider>
                    <div className="mng-create-content">
                        <InputTitle
                            type={TYPE.INPUT}
                            value={title}
                            title="Nhập tiêu đề bài viết"
                            placeholder="Tiêu đề"
                            widthLabel="200px"
                            widthInput="400px"
                            onChange={(event: any) => this.setState({ title: event })}
                        />
                        <InputTitle
                            type={TYPE.TEXT_AREA}
                            value={previewContent}
                            title="Nhập mô tả ngắn gọn"
                            placeholder="ex: nhỏ hơn 20 từ"
                            widthLabel="200px"
                            widthInput="400px"
                            onChange={(event: any) => this.setState({ previewContent: event })}
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
                            onChange={(event: any) => this.choseAnou(event)}
                        />
                        <InputTitle
                            type="SWITCH"
                            title="Ẩn - Hiện"
                            widthLabel="200px"
                        >
                            <Switch checked={!hidden} onClick={() => {
                                this.setState({ hidden: !hidden })
                            }} />
                            <label style={{ width: "40px", textAlign: "center", fontWeight: 500 }}>
                                {hidden ? "Ẩn" : "Hiện"}
                            </label>
                        </InputTitle>
                        <InputTitle
                            type=""
                            title="Ảnh đại diện"
                            widthLabel="200px"
                        >
                            <>
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
                                        (event: any) => this.uploadFileToServer(event.target.files[0], "imageUrl")
                                    } />
                                <label className='upload-img' htmlFor="avatarUrl">
                                    {!loading_avatar ? <Icon type="plus" /> :
                                        <Icon type="loading" style={{ color: "blue" }} />}
                                    <div className="ant-upload-text">Upload</div>
                                </label>
                            </>
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
                                        (event: any) => {
                                            this.uploadFileToServer(event.target.files[0], "imageContent")
                                        }
                                    }
                                />
                                <label
                                    className='upload-img-content'
                                    htmlFor="imgContent"
                                // onClick={(e: any) => e.preventDefault()}
                                >
                                    {!loading_content_img ? <Icon type="upload" /> :
                                        <Icon type="loading" style={{ color: "blue" }} />}
                                    Upload
                                </label>
                            </div>
                            <CKEditor
                                id={"editor-value"}
                                editorName="editor2"
                                config={{
                                    extraPlugins: 'stylesheetparser',
                                    height: '60vh'
                                }}
                                onBeforeLoad={(ckEditor: any) => (ckEditor.disableAutoInline = true)}
                                onBlur={event => console.log(event.editor)}
                                onChange={(event: any) => {
                                    this.setState({ content: event.editor.getData() })
                                }}
                                data={content}
                            />
                        </InputTitle>
                    </div>
                    <Divider orientation="left">Hoàn tất</Divider>
                    <div className="mng-create-content">
                        <Button
                            type="primary"
                            icon={loading_rq ? "loading" : "check"}
                            style={{
                                margin: "10px 10px",
                                float: "right"
                            }}
                            onClick={this.createAnnoucement}
                        >
                            {type_cpn === TYPE.CREATE ? "Tạo mới" : "Lưu lại"}
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
                </div>
            </>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps?: any) => ({
    getTypeManagements: () => dispatch({ type: REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES }),
    getAnnouncementDetail: (id: string) => dispatch({ type: REDUX_SAGA.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, id }),
});

const mapStateToProps = (state: any, ownProps?: any) => ({
    list_anno_type: state.AnnouTypes.items,
    announcement_detail: state.AnnouncementDetail.data
});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementCreate)