function pushMultiplySum(vec, x) {
    vec.push(x);

    for (let i = 0; i < vec.length; i++) {
        vec[i] *= 2;
    }

    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i];
    }
    
    return sum;
}