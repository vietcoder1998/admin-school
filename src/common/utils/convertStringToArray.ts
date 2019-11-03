interface IArrReturn {
    index?: number;
    value?: string;
}

export const convertStringToArray = (value?: string): Array<IArrReturn> => {
    let arr: Array<IArrReturn> = [];
    if (value) {
        let length_v = value.length;

        if (length_v && length_v > 0) {
            let i = 0;
            let index = 0;
            let temp = 0;
            while (i < length_v) {
                if ((value[i] === "." && value[i+1] === " ")  || (value[i] === "\n" && value[i-1] !== ".")) {
                    let item = { index, value: "" };

                    for (let j = temp; j <= i; j++) {
                        item.value += value[j]
                    }
                    arr.push(item);
                    temp = i + 1;
                    index++;
                }

                i++;
            }
        }

        return arr;
    }

}