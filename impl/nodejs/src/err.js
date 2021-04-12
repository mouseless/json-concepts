const NAMES = {
    SCHEMA_ERROR: 'SchemaError',
    ERROR: 'Error'
}

function err(message, name = NAMES.ERROR) {
    const result = new Error(message);

    result.name = name;

    return result;
}

module.exports = {
    NAMES,
    FILE_is_not_a_valid_json(FILE) {
        return err(`'${FILE}' is not a valid json`);
    },
    Cannot_load_URL(URL) {
        return err(`Cannot load '${URL}'`);
    },
    Cannot_load_FILE(FILE) {
        return err(`Cannot load '${FILE}'`);
    },
    Concepts_required_to_load_SCHEMA(SCHEMA) {
        return err(
            `Concepts required to load ${SCHEMA}.` +
            ` Either specify @concepts meta-data within ${SCHEMA}, or pass concepts as a parameter.`
        );
    },
    PARAMETER_is_required(PARAMETER) {
        return err(`${PARAMETER} is required`);
    },
    SCHEMA_is_not_valid(SCHEMA) {
        if(typeof SCHEMA === 'object') {
            SCHEMA = 'Schema';
        }

        return err(`${SCHEMA} is not valid`, NAMES.SCHEMA_ERROR);
    }
};