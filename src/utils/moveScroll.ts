export function moveScroll(top, left , type) {
    let state = ({top, left, behavior: 'smooth'})
    if (type == null || type === undefined){
        state = ({top, left, behavior: null})
    }
    return ;
};
