class Schema {
    static load(schemaPath, conceptsPath) {
        const schemaObject = JSON.parse(fs.readFileSync(schemaPath));

        if (schemaObject.hasOwnProperty('@concepts')) {
            conceptsPath = schemaObject['@concepts'];
        } else if(conceptsPath === null) {
            throw "error";
        }

        const conceptsObject = JSON.parse(fs.readFileSync(conceptsPath));
        delete schemaObject['@concepts'];

        return Concepts.load(conceptsObject).load(schemaObject);
    }

    #schemaObject;

    constructor(schemaObject) {
        this.#schemaObject = schemaObject;
    }
}

module.exports = { Schema };

const Concepts = require('./concepts').Concepts;
const fs = require('fs');