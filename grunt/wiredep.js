module.exports = {
    app: {
        src: ['src/index.html'],
        ignorePath: /\.\.\//
    },
    less: {
        src: ['src/css/less/*.less'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
    }
};