function exists(obj, name) {
    return obj.hasOwnProperty(symbols.metaData(name));
}

function read(obj, name, burnAfterReading = false) {
    if(!exists(obj, name)) {
        return null;
    }

    const metaDataKey = symbols.metaData(name);
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

const symbols = require('./symbols');