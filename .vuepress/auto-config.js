const fs = require('fs');
const capitalize = require('capitalize');

/**
 * @typedef {Object} Config
 * @property {Array.<String>} patterns
 * @property {Array.<{text:String,link:String}>} nav
 * @property {Object.<String,Object>} sidebar
 */
/**
 * @callback Level
 * @param {String} folder
 * 
 * @returns {Array.<String|Object>}
 */
/**
 * @param {Object.<String,Level>} folders 
 * 
 * @returns {Config}
 */
function create(folders) {
    const result = Object.freeze({
        patterns: ['*.md'],
        nav: [],
        sidebar: {}
    });

    for (const folder in folders) {
        result.patterns.push(`${folder}/**/*.md`)

        result.nav.push({
            text: capitalize.words(folder.replace(/\-/g, ' ')),
            link: `/${folder}/`
        });

        result.sidebar[`/${folder}/`] = [`/${folder}/`, ...folders[folder](folder)];
    }

    return result;
}

/**
 * @enum {Level}
 */
const Levels = {
    ONE: function (folder) {
        return [{
            title: capitalize.words(folder.replace(/\-/g, ' ')),
            collapsable: false,
            children: fs.readdirSync(folder)
                .filter(item => /\d\d\-.*[.]md/.test(item))
                .map(item => `/${folder}/${item}`)
        }];
    },
    TWO: function (folder) {
        return fs.readdirSync(folder)
            .filter(item => /\d\d\-.*/.test(item))
            .map(item => {
                const children = fs.readdirSync(`${folder}/${item}`)
                    .filter(child => /\d\d\-.*[.]md/.test(child))
                    .map(child => `/${folder}/${item}/${child.substring(0, child.length - 3)}`);

                return {
                    title: capitalize.words(item.substring(3).replace(/\-/g, ' ')),
                    path: children[0],
                    collapsable: false,
                    children: children
                }
            });
    }
}

module.exports = {
    create,
    Levels
}