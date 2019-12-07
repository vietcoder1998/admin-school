/**
 * 
 * @param arr_ex Array<any> : Example value to checktype
 * @param value Value to find
 * @param param type param of arr_ex to compare
 * @param typeReturn type param of arr_ex to return
 */

export const findIdWithValue = (arr_ex?: Array<any>, value?: any, param?: string, typeReturn?: string): any => {
    let result: any;
    if (typeof value === "string" || typeof value === "number") {
        arr_ex.forEach((item: any, index: number) => {
            if (item[param] === value) {
                if (typeReturn) {
                    result = item[typeReturn]
                } else result = item.id;
            }
        })
    } else {
        if (value && value !== []) {
            let list_arr = [];
            value.forEach((element: string | number, index: number) => {
                let new_arr = arr_ex.filter((item: any, index: number) => { return item[param] === element });
                new_arr.forEach((item: any, index: any) => list_arr.push(item[typeReturn]));
            });

            result = list_arr;
        }
    }

    return result;
}