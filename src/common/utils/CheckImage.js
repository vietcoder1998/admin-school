
export const testImage = (defaultImage, type) => {
    if (defaultImage !== null) {
        return defaultImage;
    } else {
        if (type === 'logo') {
            return ""
        }
    }

    return "";
}