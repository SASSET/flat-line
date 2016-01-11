'use strict';

function tester(){
    const arr = [1,2, ...arguments]
    console.log('ARR',arr);
}

tester('FOO','bar');