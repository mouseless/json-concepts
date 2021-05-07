/**
 * Loads json file in given path. If `relativeTo` is given and if `path` is a
 * relative path, then file is loaded from path relative to the value of
 * `relativeTo`.
 * 
 * @async
 * @param {String} path (Required) Path or URL to load json from
 * @param {String} relativeTo Path or URL to load file relatively to
 * 
 * @returns {Promise<Object>} Loaded object
 */
async function loadJSON(
    path = required('path'),
    relativeTo
) {
    checkType(path, 'string');

    if (relativeTo && !_isURL(path) && !p.isAbsolute(path)) {
        if (_isURL(relativeTo)) {
            path = new URL(path, relativeTo).toString();
        } else {
            path = p.resolve(p.dirname(relativeTo), path);
        }
    }

    let json = '';
    if (_isURL(path)) {
        try {
            json = await _get(path);
        } catch {
            throw error.Cannot_load_URL(path);
        }
    } else {
        try {
            json = fs.readFileSync(path);
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
 * @param {*} url 
 * 
 * @returns 
 */
function _isURL(path) {
    return path.startsWith('http://') || path.startsWith('https://');
}

/**
 * 
 * @param {String} url 
 * 
 * @returns  {Promise.<Object>}
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

const p = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { required, checkType } = require('./validation');
const error = require('./error');
const { url } = require('inspector');
