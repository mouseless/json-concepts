const { Concepts, Schema } = require('../..');
const fs = require('fs');
const { should } = require('chai');
const { base } = require('../lib');

should();

describe('examples', function () {
    const examples = fs
        .readdirSync(`${base}/examples`, { withFileTypes: true })
        .flatMap(folder => fs.readdirSync(`${base}/examples/${folder.name}`, { withFileTypes: true })
            .map(file => {
                return {
                    name: `${folder.name}/${file.name}`,
                    path: `${base}/examples/${folder.name}/${file.name}`
                };
            })
        );

    examples.forEach(example => {
        it(`should validate ${example.name}`, async function () {
            if (example.name.endsWith('.concepts.json')) {
                await Concepts.load(example.path)
                    .should.not.be.rejected;
            } else {
                await Schema.load(example.path)
                    .should.not.be.rejected;
            }
        });
    });
});
