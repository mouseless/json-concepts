module.exports = {
    FILE_is_not_a_valid_json(FILE) {
        return new Error(`File '${FILE}' is not a valid json`);
    }
};