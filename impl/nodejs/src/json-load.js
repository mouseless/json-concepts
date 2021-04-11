JSON.load = function (pathOrObject) {
    let result = pathOrObject;
    
    if (typeof pathOrObject === 'string') {
        let content = '';

        if (pathOrObject.startsWith('http://') ||
            pathOrObject.startsWith('https://')) {
            content = axios.get(pathOrObject);
            console.log(content);
        } else {
            content = fs.readFileSync(pathOrObject);
        }

        try {
            result = JSON.parse(content);
        } catch {
            throw ERR.FILE_is_not_a_valid_json(pathOrObject);
        }
    }

    return result;
};

const ERR = require('./err');
const fs = require('fs');
const axios = require('axios');