const Names = {
    SCHEMA_ERROR: 'SchemaError',
    ERROR: 'Error'
}

function error(message, name = Names.ERROR) {
    const result = new Error(message);

    result.name = name;

    return result;
}

module.exports = {
    Names,
    FILE_is_not_a_valid_json(FILE) {
        return error(`'${FILE}' is not a valid json`);
    },
    Cannot_load_URL(URL) {
        return error(`Cannot load '${URL}'`);
    },
    Cannot_load_FILE(FILE) {
        return error(`Cannot load '${FILE}'`);
    },
    Concepts_required_to_load_SCHEMA(SCHEMA) {
        return error(
            `Concepts required to load ${SCHEMA}.` +
            ` Either specify @concepts meta-data within ${SCHEMA}, or pass concepts as a parameter.`
        );
    },
    PARAMETER_is_required(PARAMETER) {
        return error(`${PARAMETER} is required`);
    },
    SCHEMA_is_not_valid(SCHEMA) {
        if(typeof SCHEMA === 'object') {
            SCHEMA = 'Schema';
        }

        return error(`${SCHEMA} is not valid`, Names.SCHEMA_ERROR);
    }
};