export const deepCopy = <T>(oldObj: any) =>{
    var newObj = oldObj;
    if (oldObj && typeof oldObj === "object") {
        newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
        for (var i in oldObj) {
            newObj[i] = deepCopy(oldObj[i]);
        }
    }
    return <T>newObj;
};
