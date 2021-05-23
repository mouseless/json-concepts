const fs = require('fs');
const capitalize = require('capitalize');

function create(folders) {
    const result = Object.freeze({
        pagePatterns: ['*.md'],
        navbar: [],
        sidebar: {}
    });

    for (const folder in folders) {
        result.pagePatterns.push(`${folder}/**/*.md`)

        result.navbar.push({
            text: capitalize.words(folder.replace(/-/g, ' ')),
            link: `/${folder}/`
        });

        result.sidebar[`/${folder}/`] = folders[folder](folder);
    }

    return result;
}

const Levels = {
    ONE: function (folder) {
        return [
            {
                text: capitalize.words(folder.replace(/-/g, ' ')),
                isGroup: true,
                children: [
                    `/${folder}/`,
                    ...fs.readdirSync(folder)
                        .filter(item => /[X\d]{2}-.*[.]md/.test(item))
                        .map(item => `/${folder}/${item}`)
                ]
            }
        ];
    },
    TWO: function (folder) {
        return [
            {
                text: capitalize.words(folder.replace(/-/g, ' ')),
                isGroup: true,
                link: `/${folder}/`,
                children: [`/${folder}/`]
            },
            ...fs.readdirSync(folder)
                .filter(item => /[X\d]{2}-.*/.test(item))
                .map(item => {
                    const children = fs.readdirSync(`${folder}/${item}`)
                        .filter(child => /[X\d]{2}-.*[.]md/.test(child))
                        .map(child => `/${folder}/${item}/${child}`);

                    return {
                        text: capitalize.words(item.substring(3).replace(/-/g, ' ')),
                        link: children[0].link,
                        isGroup: true,
                        children: children
                    }
                })
        ];
    }
}

module.exports = {
    create,
    Levels
};