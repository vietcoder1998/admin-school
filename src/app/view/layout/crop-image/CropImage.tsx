import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';

interface IProps {
  uploadToServer?: Function;
}

interface IState {
  src?: string | ArrayBuffer;
  crop?: any;
  croppedImageUrl?: any;
  blobFile?: any;
  imageRef?: any;
  fileUrl?: any;
  cropImage?: Blob;
}


class CropImage extends PureComponent<IProps, IState> {
  state = {
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 1480 / 650,
    },
    croppedImageUrl: null,
    fileUrl: null,
    imageRef: null,
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.setState({ imageRef: image })
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
    this.props.uploadToServer(this.state);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    let { imageRef } = this.state;
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        imageRef,
        crop,
        'banner.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        let { fileUrl } = this.state;

        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        //@ts-ignore
        blob.name = fileName;
        window.URL.revokeObjectURL(fileUrl);
        fileUrl = window.URL.createObjectURL(blob);
        this.setState({blobFile: blob})

        resolve(fileUrl);
      }, 'image/jpeg');
    });
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div className="crop" style={{textAlign: "center"}}>
        <div style={{marginBottom: 10}}>
          <input type="file" accept="image/*" onChange={this.onSelectFile} />
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            ruleOfThirds
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        <div>
          Ảnh xem trước
        </div>
        {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
        )}
      </div>
    );
  }
}

export default CropImage;