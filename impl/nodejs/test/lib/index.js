const { readFileSync } = require('fs');
const { bypass } = require('mock-fs');

const base = '../../.dist';

module.exports = {
    base,
    readTestCase(fixture, file) {
        let folder = fixture.title.replace('specs/', '');
        while (fixture.parent && fixture.parent.title) {
            fixture = fixture.parent;

            folder = fixture.title.replace('specs/', '') + '/' + folder;
        }

        return JSON.parse(bypass(() => readFileSync(`${base}/test-cases/${folder}/${file}`)));
    }
};
