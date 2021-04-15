/**
 * @async
 * @param {String|Object} pathOrObject
 * 
 * @returns {Promise<Object>}
 */
async function loadJSON(pathOrObject = required('pathOrObject')) {
    if (typeof pathOrObject === 'object') {
        return pathOrObject;
    }

    const path = pathOrObject;
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

/**
 * Loads data from given url.
 * 
 * @async
 * @param {string} url A url that starts with 'http://' or 'https://'
 * @returns {Promise<string>} Data that is returned from given url
 */
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
const { required } = require('./required');
const error = require('./error');