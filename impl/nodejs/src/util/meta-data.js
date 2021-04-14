function exists(obj, name) {
    return obj.hasOwnProperty(sc.to(sc.META_DATA, name));
}

function read(obj, name, burnAfterReading = false) {
    if (!exists(obj, name)) {
        return null;
    }

    const metaDataKey = sc.to(sc.META_DATA, name);
    const result = obj[metaDataKey];

    if (burnAfterReading) {
        delete obj[metaDataKey];
    }

    return result;
};

module.exports = {
    exists,
    read
};

const sc = require('./special-characters');