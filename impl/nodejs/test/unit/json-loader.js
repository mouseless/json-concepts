const JSONLoader = require('../../src/json-loader').JSONLoader;

describe('json-loader', function () {
    it('should load if file exists and a valid json');
    it('should give error if file is not json');
    it('should load remote file if it is a url');
    it('should give error when remote file does not exist');
    it('should give error when local file does not exists');
    it('should return given object if it is already an object');
});
