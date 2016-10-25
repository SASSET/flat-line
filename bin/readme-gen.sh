#!/bin/bash

function get_file_path {
	echo "$( cd "$( dirname "$0" )" && pwd )"
}

function get_dir_path {
	echo "$( cd "$1" && pwd )"
}


this_script="${BASH_SOURCE[0]}"
this_dir=$(get_file_path "${this_script}")
project_root=$(get_dir_path "${this_dir}/../")
node_modules_path=$(get_dir_path "${project_root}/node_modules/")
readme_path="${project_root}/README.md"

if [[ $1 == '-v' ]] || [[ $1 == '--verbose' ]]; then
	echo "This Script: ${this_script}"
	echo "Scripts Dir: ${this_dir}"
	echo "Project Root: ${project_root}"
	echo "Node Modules Path: ${node_modules_path}"
	echo "Readme Path: ${readme_path}"
fi

echo -n "Generating readme file at: ${readme_path}... "

node "${node_modules_path}/jsdoc-to-markdown/bin.js" --files "${project_root}/flat-line.js"  --separators | node "${node_modules_path}/jsdoc2md-anchors/bin/jsdoc2md-anchors.js" > "${project_root}/README.md"

if [[ $? -ne 0 ]]; then
	echo "Failed to create README file..."
else
	echo "Done"
fi