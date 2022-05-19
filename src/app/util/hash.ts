const  getRandom = (min, max, int): number => {
    let rand = min + Math.random() * (max - min);
    if (int) {
        rand = Math.round(rand)
    }
    return rand;
}

export const hashGenerate = () => {
    const $possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash = '';
    for (let i = 0; i < 32; i++) {
        hash += '' + $possible[getRandom(0, 61, true)];
    }
    return hash
};
