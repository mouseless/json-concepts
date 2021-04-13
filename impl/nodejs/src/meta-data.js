function exists(obj, name) {
    return obj.hasOwnProperty(SYM.to(SYM.META_DATA, name));
}

function read(obj, name, burnAfterReading = false) {
    if(!exists(obj, name)) {
        return null;
    }

    const metaDataKey = SYM.to(SYM.META_DATA, name);
    const result = obj[metaDataKey];

    if(burnAfterReading) {
        delete obj[metaDataKey];
    }
    
    return result;
};

module.exports = {
    exists,
    read
};

const SYM = require('./symbols');