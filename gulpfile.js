'use strict'

const gulp    = require('gulp')
const del     = require('del')
const babel   = require('gulp-babel')
const argv    = require('yargs').argv

const jsSrc   = 'src/**/*.js'
const jsonSrc = 'src/*.json'
const dist    = 'dist'

// Remove any files from the ./dist dir - This prevents files that were
// deleted from src from still remaining in dist
gulp.task('clean-dist', function () {
    return del([
        'dist/*'
    ])
})

// Transpile from ES6 to ES5
gulp.task( 'transpile', () => {
    return gulp
        .src( jsSrc )
        .pipe( babel( {
            presets: [ 'es2015' ]
        }))
        .pipe( gulp.dest( dist ) )
})

// Copy JSON files
gulp.task( 'copy-json-files', () => {
    return gulp
        .src( jsonSrc )
        .pipe( gulp.dest( dist ) )
})

// Check if --watch true was passed to the command line
if( typeof argv.watch !== 'undefined' && !!argv.watch ){
    console.log('Watching enabled!')

    gulp.task('default',[ 'clean-dist', 'transpile', 'copy-json-files' ], () => {
        return gulp.watch([ jsSrc, jsonSrc ], [ 'clean-dist', 'transpile','copy-json-files' ])
    })
}
else {
    gulp.task('default',[ 'clean-dist', 'transpile', 'copy-json-files' ])
}