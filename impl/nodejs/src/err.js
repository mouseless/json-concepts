module.exports = {
    FILE_is_not_a_valid_json(FILE) {
        return new Error(`'${FILE}' is not a valid json`);
    },
    Cannot_load_URL(URL) {
        return new Error(`Cannot load '${URL}'`);
    },
    Cannot_load_FILE(FILE) {
        return new Error(`Cannot load '${FILE}'`);
    }
};