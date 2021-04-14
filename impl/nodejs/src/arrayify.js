function get(source, key) {
    if (!source.hasOwnProperty(key)) {
        return [];
    }

    if (!Array.isArray(source[key])) {
        return [source[key]];
    }

    return source[key];
}

function pushOrSet(source, key, value) {
    if (!source.hasOwnProperty(key)) {
        source[key] = value;
    } else {
        if (!Array.isArray(source[key])) {
            source[key] = [source[key]];
        }

        source[key].push(value);
    }
}

module.exports = { get, pushOrSet };