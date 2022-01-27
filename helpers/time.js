const tenAgo = () => {
    const now = new Date().getTime();
    const tenMin = 1000 * 60 * 200;
    const tenAgo = now - tenMin;
    return tenAgo;
}

exports.tenAgo = tenAgo;