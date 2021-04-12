function required(name = required('name')) {
    throw ERR.PARAMETER_is_required(name);
} 

module.exports = {
    required
};

const ERR = require('./err');