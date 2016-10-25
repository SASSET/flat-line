#!/bin/bash


jsdoc_bin="/usr/local/bin/jsdoc"

project_root="/Users/jhyland/Documents/Projects/flat-line"
project_doc_path="${project_root}/docs"


jsdoc_template="${project_doc_path}/templates/docdash-custom"
#jsdoc_template="/Users/jhyland/Documents/scripts/node/personal/sasset-core-beta/docs/templates/jaguarjs/docs/templates/jaguar"
#jsdoc_template="/Users/jhyland/Documents/scripts/node/personal/sasset-core-beta/node_modules/docdash"
jsdoc_destination="${project_doc_path}/html"


jsdoc_input="${project_root}/flat-line.js"
jsdoc_readme="${project_root}/README.md"

#jsdoc_switches="--verbose"

# Example command
# jsdoc --template /Users/jhyland/Documents/scripts/node/personal/sasset-core-beta/docs/jsdoc-template --verbose --destination /Users/jhyland/Documents/scripts/node/personal/sasset-core-beta/docs /Users/jhyland/Documents/scripts/node/personal/sasset-core-beta/models/Asset.js


if [[ ! -a "${jsdoc_destination}" ]]; then
	echo -n "The destination ${jsdoc_destination} does not exist, creating it ... "
	
	mkdir "${jsdoc_destination}"

	if [[ $? -ne 0 ]]; then
        echo "Error!"
        exit 1
    else
        echo "Done"
    fi
fi

if [[ $(ls "${jsdoc_destination}" 2>/dev/null | wc -l) -ne 0 ]]; then
    echo -n "Clearing the existing content: ${jsdoc_destination}/* ... "
    rm -rf "${jsdoc_destination}"
    
    if [[ $? -ne 0 ]]; then
        echo "Error!"
        exit 1
    else
        echo "Done"
    fi
fi

command="${jsdoc_bin} --readme '${jsdoc_readme}' --template '${jsdoc_template}' --destination '${jsdoc_destination}' --recurse '${jsdoc_input}'"

echo "Executing: ${command}"
eval $command
exit

# Execute!
echo "Command: ${jsdoc_bin} --verbose --readme \"${jsdoc_readme}\" --template \"${jsdoc_template}\" --destination \"${jsdoc_destination}\" --recursive \"${jsdoc_input}\""
${jsdoc_bin} --verbose --readme "${jsdoc_readme}" --template "${jsdoc_template}" --destination "${jsdoc_destination}" --recurse "${jsdoc_input}"
