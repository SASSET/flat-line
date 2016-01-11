'use strict';

function tester() {
    var arr = [1, 2].concat(Array.prototype.slice.call(arguments));
    console.log('ARR', arr);
}

tester('FOO', 'bar');