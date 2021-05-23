const path = require('path');
const fs = require('fs');
const cb = require('code-blocks');

fs.rmdirSync('./.dist/test-cases', { recursive: true });

const specDirOrFile = /[0-9]{2}-[a-z-]*([.]md)?/; // 01-spec-dir or 01-spec-file.md
const specFiles = files('./specs', entry => specDirOrFile.test(entry.name));
const specs = fromFileToSpec(specFiles, _ => {
    return {
        section: _.file.parent.name,
        name: _.file.name.substring(0, _.file.name.length - 3),
        path: _.file.path
    };
});

const testCases = fromSpecToTestCase(specs, _ => {
    return {
        path: `./.dist/test-cases/${_.spec.section}/${_.spec.name}/${_.block.info.name}`,
        content: _.block.value
    };
});

for (const testCase of testCases) {
    if (fs.existsSync(testCase.path)) {
        throw new Error(`'${testCase.path}' already exists`);
    }

    const dir = path.dirname(testCase.path);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(testCase.path, testCase.content);
}

function files(root, filter, _parent) {
    const entries = fs
        .readdirSync(root, { withFileTypes: true })
        .filter(file => filter(file));

    if (entries.length == 0) {
        return {};
    }

    const result = {};
    for (const file of entries) {
        if (file.isDirectory()) {
            result[file.name] = {
                type: 'directory',
                path: `${root}/${file.name}`,
                name: file.name,
                parent: _parent
            };

            result[file.name].children = files(`${root}/${file.name}`, filter, result[file.name]);
        } else {
            result[file.name] = {
                type: 'file',
                path: `${root}/${file.name}`,
                name: file.name,
                parent: _parent
            };
        }
    }

    return result;
}

function fromFileToSpec(specFiles, map) {
    const result = [];
    for (const sectionDir of Object.values(specFiles)) {
        for (const specFile of Object.values(sectionDir.children)) {
            result.push(map({ file: specFile }));
        }
    }
    return result;
}

function fromSpecToTestCase(specs, map) {
    const result = [];
    specs.forEach(spec => {
        const blocks = cb.fromFileSync(spec.path);
        for (const block of blocks.filter(b => b.info.name)) {
            result.push(map({ spec, block }));
        }
    });
    return result;
}