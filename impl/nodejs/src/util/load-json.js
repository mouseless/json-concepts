/**
 * Loads json file in given path
 * 
 * @async
 * @param {String} path Path or URL to load json from
 * 
 * @returns {Promise<Object>} Loaded object
 */
async function loadJSON(path = required('path')) {
    checkType(path, 'string');

    let json = '';

    if (path.startsWith('http://') ||
        path.startsWith('https://')) {
        try {
            json = await _get(path);
        } catch {
            throw error.Cannot_load_URL(path);
        }
    } else {
        try {
            json = await fs.readFileSync(path);
        } catch {
            throw error.Cannot_load_FILE(path);
        }
    }

    try {
        return JSON.parse(json);
    } catch {
        throw error.FILE_is_not_a_valid_json(path);
    }
};

async function _get(url) {
    return new Promise((resolve, reject) => {
        const make = url.startsWith("https") ? https : http;

        make.request(url, res => {
            if (!_is2xx(res.statusCode)) {
                reject(new Error());
                return;
            }

            res.on('data', data => {
                resolve(data);
            });
        }).on('error', e => {
            reject(e);
        }).end();
    });
}

function _is2xx(statusCode) {
    return statusCode / 100 === 2;
}

module.exports = {
    loadJSON
};

const fs = require('fs');
const http = require('http');
const https = require('https');
const { required, checkType } = require('./validation');
const error = require('./error');