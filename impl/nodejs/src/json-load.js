/**
 * @async
 * @param {Object} pathOrObject
 * 
 * @returns {Promise<Object>}
 */
JSON.load = async function (pathOrObject) {
    if (typeof pathOrObject === 'object') {
        return pathOrObject;
    }

    const path = pathOrObject;
    let json = '';

    if (path.startsWith('http://') ||
        path.startsWith('https://')) {
        try {
            json = await get(path);
        } catch {
            throw ERR.Cannot_load_URL(path);
        }
    } else {
        try {
            json = await fs.readFileSync(path);
        } catch {
            throw ERR.Cannot_load_FILE(path);
        }
    }

    try {
        return JSON.parse(json);
    } catch {
        throw ERR.FILE_is_not_a_valid_json(path);
    }
};

/**
 * Loads data from given url.
 * 
 * @async
 * @param {string} url A url that starts with 'http://' or 'https://'
 * @returns {Promise<string>} Data that is returned from given url
 */
async function get(url) {
    return new Promise((resolve, reject) => {
        const make = url.startsWith("https") ? https : http;

        make.request(url, res => {
            if (!is2xx(res.statusCode)) {
                reject(new Error());
                return;
            }

            res.on('data', data => {
                resolve(data);
            });
        }).on('error', error => {
            reject(error);
        }).end();
    });
}

function is2xx(statusCode) {
    return statusCode / 100 === 2;
}

const ERR = require('./err');
const fs = require('fs');
const http = require('http');
const https = require('https');