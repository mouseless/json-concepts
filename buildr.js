module.exports = {
    concepts,
    schema,
    code,
    transform,
    readJson,
    readString,
    writeJson,
    writeString,
    renderJson,
    renderString
};

// imports

const fs = require('fs');
const jp = require('jsonpath');
const jf = require('json-format');
const ms = require('mustache');
const cc = require('camel-case').camelCase;
const jfFormat = { type: 'space', size: 2 };

// end imports 

// public

String.prototype.after = function (separator) {
    const parts = this.split(separator);

    return parts.length > 1 ? parts[1] : '';
}

String.prototype.afterLast = function (separator) {
    const parts = this.split(separator);

    return parts[parts.length - 1];
}

String.prototype.toCamelCase = function () {
    return cc(this);
}

String.prototype.prepend = function (prefix) {
    return prefix + this;
}

function readJson(filePath) { if (filePath == null) { return {}; } return JSON.parse(fs.readFileSync(filePath)); }
function readString(filePath) { if (filePath == null) { return ""; } return fs.readFileSync(filePath).toString(); }
function writeJson(filePath, obj) { return fs.writeFileSync(filePath, jf(obj, jfFormat)); }
function writeString(filePath, str) { return fs.writeFileSync(filePath, str); }

function renderJson({ template, templatePath, view }) {
    if (template == null) {
        template = readString(templatePath);
    }

    return JSON.parse(renderString({ template, templatePath, view }));
}

function renderString({ template, templatePath, view }) {
    if (template == null) {
        template = readString(templatePath);
    }

    return ms.render(template, view);
}

/**
 * @param {Object}  options
 * @param {String}  options.name
 * @param {String}  options.ref
 */
function concepts({ ref, name = ref }) {
    const result = {};

    result.name = name;

    if (ref != null) {
        result.isRef = true;

        return result;
    }

    result.concepts = readJson(`./${name}.concepts.json`);
    result.schema = buildSchema({ concepts: result.concepts });
    result.template = buildTemplate({ schema: result.schema });

    return result;
}

/**
 * @param {Object}  options
 * @param {String}  options.name
 * @param {Object}  options.from
 * @param {Object}  options.concept
 */
function schema({ name, from, concept }) {
    const result = {};

    result.name = name;
    result.concept = concept;

    if (concept.isRef) {
        result.schemaView = readJson(`../../${concept.name}/schema/${name}.view.json`);

        return result;
    }

    result.schemaView = transform({
        schema: concept.schema,
        transformationsPath: `./transformations/from.${from.concept.name}.json`,
        source: from.schemaView
    });
    result.schema = renderJson({
        template: concept.template,
        view: result.schemaView
    });

    writeJson(`../schema/${name}.view.json`, result.schemaView);
    writeJson(`../schema/${name}.json`, result.schema);

    return result;
}

function code({ file, template, schema }) {
    const result = {};

    result.code = renderString({ templatePath: `./${template}.mustache`, view: schema.schemaView });
    writeString(`${file}`, result.code);

    return result;
}

// end public

// private 

function buildSchema({ concepts }) {
    const metaSchema = {};

    for (let concept in concepts) {
        concept = concepts[concept];

        if (!Array.isArray(concept)) {
            concept = [concept];
        }

        for (let item in concept) {
            item = concept[item];

            let paths = item.path;
            if (!Array.isArray(paths)) {
                paths = [paths]
            }

            for (let path in paths) {
                path = paths[path];

                let parts = path.split('/');
                path = "$";
                for (let part in parts) {
                    part = parts[part];

                    if (part === '') {
                        continue;
                    } else if (part === '**') {
                        path += '..';
                    } else {
                        path += `['${part}','${part}+','${part}?','${part}*']`;
                    }
                }

                const targets = jp.query(metaSchema, path);

                for (let target in targets) {
                    target = targets[target];

                    Object.assign(target, item.schema);
                }
            }
        }
    }

    return metaSchema;
}

function t(level, forceNextLineOnLevelZero = false) {
    let result = level > 0 || forceNextLineOnLevelZero ? '\n' : '';
    for (let i = 0; i < level; i++) {
        result += '    ';
    }
    return result;
}

function buildTemplate({ schema, l = 0 }) {
    if (typeof schema !== 'object') {
        if (typeof schema === 'string') {
            if (schema.startsWith('$')) {
                return `"{{${schema.replace('$', '')}}}"`
            }
        }
        return JSON.stringify(schema);
    }

    let template = "";
    let previous = null;
    for (const childSchema in schema) {
        if (childSchema == '#') {
            continue;
        }

        const child = {
            schema: schema[childSchema],
            isConcept: childSchema.startsWith("$"),
            name: childSchema.replace(/[$+?*]/g, ''),
            rule: function () { return childSchema.replace('$', '').replace(this.name, ''); },
            isOptional: function () { return this.rule() == '?' || this.rule() == '*'; },
            isMultiple: function () { return this.rule() == '+' || this.rule() == '*'; }
        };

        if (previous != null) {
            if (child.isConcept && child.isOptional()) {
                template += `${t(l + 1)}{{#${child.name}.length}}${t(l + 1)},${t(l + 1)}{{/${child.name}.length}}${t(l + 1)}`;
            } else {
                template += `,${t(l + 1)}`
            }
        }

        if (child.isConcept) {
            const concept = child.name;

            let name = "name";
            if (typeof (child.schema) !== 'object') {
                name = ".";
            }

            template += `{{#${concept}}}`;
            template += `${t(l + 1)}"{{${name}}}": ${buildTemplate({ schema: child.schema, l: l + 1 })}`;
            if (typeof child.schema === 'object') {
                template += `{{^_last}},{{/_last}}`;
            }
            template += `${t(l + 1)}{{/${concept}}}`;
        } else {
            const tag = child.name;
            template += `"${tag}": ${buildTemplate({ schema: child.schema, l: l + 1 })}`;
        }

        previous = child;
    }
    return `${t(l)}{${t(l + 1)}${template}${t(l, true)}}`;
}

function transform({
    schema,
    transformationsPath,
    transformations = readJson(transformationsPath),
    sourcePath,
    source = readJson(sourcePath),
    target,
    concept
}) {
    if (target == null) {
        target = {};
    }

    if (concept == null) {
        if (typeof schema === 'object') {
            for (const childPattern in schema) {
                const options = {
                    schema: schema[childPattern],
                    transformations: transformations,
                    source: source,
                    target: target,
                };

                const childIsConcept = childPattern.startsWith('$');
                if (childIsConcept) {
                    options.concept = childPattern.replace(/[$*?+]/g, '');
                }

                transform(options);
            }
        }
    } else {
        const targetArray = [];

        if (transformations.hasOwnProperty(concept)) {
            const transformation = transformations[concept];

            const sourceArray = jp.query(source, `${transformation.$path}`);

            for (let sourceItem in sourceArray) {
                sourceItem = sourceArray[sourceItem];

                let targetItem = null;

                if (transformation.hasOwnProperty(".")) {
                    const value = transformation["."];

                    if (value === '.') {
                        targetItem = sourceItem;
                    } else {
                        targetItem = eval(`sourceItem.${value}`);
                    }

                } else {
                    targetItem = {};
                    targetItem._first = sourceItem === sourceArray[0];

                    for (const key in transformation) {
                        if (key.startsWith("$")) {
                            continue;
                        }

                        const value = transformation[key];

                        targetItem[key] = eval(`sourceItem.${value}`);
                        targetItem[`${concept}_${key}`] = targetItem[key];
                    }

                    if (typeof schema === 'object') {
                        for (const childPattern in schema) {
                            const options = {
                                target: targetItem,
                                source: sourceItem,
                                schema: schema[childPattern],
                                transformations: transformations
                            };

                            const childIsConcept = childPattern.startsWith('$');
                            if (childIsConcept) {
                                options.concept = childPattern.replace(/[$*?+]/g, '');
                            }

                            transform(options);
                        }
                    }

                    targetItem._last = sourceItem === sourceArray[sourceArray.length - 1];
                }

                targetArray.push(targetItem);
            }
        }

        target[concept] = targetArray;
    }

    return target;
}

//end private