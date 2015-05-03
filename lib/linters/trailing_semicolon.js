'use strict';

var findIndex = require('lodash.findindex');
var path = require('path');

module.exports = function (options) {
    var filename = path.basename(options.path);
    var config = options.config;
    var node = options.node;
    var checkIndex;
    var property;
    var start;

    // Bail if the linter isn't wanted
    if (config.trailingSemicolon && !config.trailingSemicolon.enabled) {
        return null;
    }

    // Not applicable, bail
    if (node.type !== 'block') {
        return null;
    }

    // Find declarations
    checkIndex = findIndex(node.content, function (element) {
        return element.type === 'declaration';
    });

    // No declarations found, bail
    if (checkIndex === -1) {
        return null;
    }

    if (node.content[checkIndex + 1].type !== 'declarationDelimiter') {
        start = node.content.pop().start;

        return {
            column: start.column,
            file: filename,
            line: start.line,
            linter: 'trailingSemicolon',
            message: 'All property declarations should end with a semicolon.'
        };
    }

    return true;
};