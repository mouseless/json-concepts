const { watch } = require('fs');
const pj = require('prettyjson');
const jc = require('../impl/nodejs');

const conceptsFile = process.argv[2];
const schemaFile = process.argv[3];

if (!conceptsFile || !schemaFile) {
    console.log("specify concepts and schema files to validate.");
    process.exit(1);
}

validate();

watch(conceptsFile).on('change', async () => await validate());
watch(schemaFile).on('change', async () => await validate());

async function validate() {
    console.clear();

    try {
        const schema = await jc.Schema.load(schemaFile, conceptsFile);

        console.log(`\x1b[32m${schemaFile} is valid!\x1b[37m`);
        //console.log(pj.render(schema.shadow));
    } catch (e) {
        console.error(`\x1b[31m${e.message}\x1b[37m`);
    }

    console.log();
    console.log(`watching '${conceptsFile}' and '${schemaFile}' for changes...`);
}
