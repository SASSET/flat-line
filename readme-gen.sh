#!/bin/bash

node node_modules/jsdoc-to-markdown/bin.js --files flat-line.js  --separators | node node_modules/jsdoc2md-anchors/bin/jsdoc2md-anchors.js > README.md