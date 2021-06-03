const { readFileSync } = require('fs');
const { bypass } = require('mock-fs');
const path = require('path');

module.exports = {
    readTestCase(fixture, file) {
        let folder = fixture.title.replace('specs/', '');
        while (fixture.parent && fixture.parent.title) {
            fixture = fixture.parent;

            folder = fixture.title.replace('specs/', '') + '/' + folder;
        }

        return JSON.parse(bypass(() => readFileSync(`../../.dist/test-cases/${folder}/${file}`)));
    }
};