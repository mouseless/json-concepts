const path = require('path');
const fs = require('fs');
const cb = require('code-blocks');

fs.rmdirSync('./.dist', { recursive: true });

// 01-spec-dir or 01-spec-file.md
const specDirOrFile = /^[0-9]{2}-[a-z-]*([.]md)?$/;
const specFiles = files('./specs', entry => specDirOrFile.test(entry.name));
const specs = fromFileToTwoLevelHierarchy(specFiles, _ => {
    return {
        section: _.file.parent.name.substring(3, _.file.parent.name.length),
        name: _.file.name.substring(3, _.file.name.length - 3),
        path: _.file.path
    };
});
const testCases = fromSpecToTestCase(specs, _ => {
    return {
        path: `./.dist/test-cases/${_.spec.section}/${_.spec.name}/${_.block.info.name}`,
        content: _.block.value
    };
});
// example-folder or example.json
// - exclude hidden e.g. .gitignore
// - exclude drafts e.g. xx-not-yet
const exampleDirOrFile = /^(?!\.)(?!xx-)[a-z-]*(([.][a-z-]*)?[.]json)?$/;
const exampleFiles = files('./examples', entry => exampleDirOrFile.test(entry.name));
const examples = fromFileToTwoLevelHierarchy(exampleFiles, _ => {
    return {
        group: _.file.parent.name,
        name: _.file.name,
        path: _.file.path
    };
});

// copy specs to .dist/specs
for (const spec of specs) {
    const targetPath = `./.dist/specs/${spec.section}/${spec.name}.md`;

    mkdir(targetPath);
    fs.copyFileSync(spec.path, targetPath);
}

// extract code blocks to .dist/test-cases
for (const testCase of testCases) {
    if (fs.existsSync(testCase.path)) {
        throw new Error(`'${testCase.path}' already exists`);
    }

    mkdir(testCase.path);
    fs.writeFileSync(testCase.path, testCase.content);
}

// copy examples to .dist/examples
for (const example of examples) {
    const targetPath = `./.dist/examples/${example.group}/${example.name}`;

    mkdir(targetPath);
    fs.copyFileSync(example.path, targetPath);
}

function mkdir(targetPath) {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function files(root, filter, _parent) {
    const entries = fs
        .readdirSync(root, { withFileTypes: true })
        .filter(file => filter(file) && file.name != 'node_modules');

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

function fromFileToTwoLevelHierarchy(files, map) {
    const result = [];
    for (const parent of Object.values(files)) {
        if (parent.children) {
            for (const child of Object.values(parent.children)) {
                result.push(map({ file: child }));
            }
        }
    }
    return result;
}

function fromSpecToTestCase(specs, map) {
    const result = [];
    specs.forEach(spec => {
        const blocks = cb.fromFileSync(spec.path);
        for (const block of blocks.filter(b => b.info.name)) {
            if (block.lang === 'json') {
                try {
                    JSON.parse(block.value);
                } catch (e) {
                    console.error(`\x1b[31m` +
                        `invalid json '${block.info.name}' ` +
                        `at ${block.position.start.line}-${block.position.end.line} ` +
                        `in '${block.source.file}'.\n` +
                        `${e}` +
                        `\x1b[37m`);

                    process.exit(1);
                }
            }

            result.push(map({ spec, block }));
        }
    });
    return result;
}