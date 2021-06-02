const { readFileSync } = require('fs');

module.exports = {
    readTestCase(fixture, file) {
        let folder = fixture.title.replace('specs/', '');
        while (fixture.parent) {
            fixture = fixture.parent;

            folder = fixture.title.replace('specs/', '') + '/' + folder;
        }

        return JSON.parse(readFileSync(`../../.dist/test-cases/${folder}/${file}`));
    }
};