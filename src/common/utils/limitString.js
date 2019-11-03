export const limitString = (content, limit) => {
    let length = content && content.length;
    let result = '';
    let maxLength = 20;

    if (limit) {
        maxLength = limit;
    }

    if (content) {
        if (limit > length) {
            return content
        } else {
            for (let i = 0; i < maxLength; i++) {
                result += content[i] ? content[i] : ''
            }

            return (result + '...');
        }
    }
}