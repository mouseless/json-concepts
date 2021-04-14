function required(name = required('name')) {
    throw error.PARAMETER_is_required(name);
}

module.exports = {
    required
};

const error = require('./error');