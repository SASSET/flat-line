#!/bin/bash

function get_file_path {
	echo "$( cd "$( dirname "$0" )" && pwd )"
}

function get_dir_path {
	echo "$( cd "$1" && pwd )"
}


this_script="${BASH_SOURCE[0]}"
this_dir=$(get_file_path "${this_script}")
project_dir=$(get_dir_path "${this_dir}/../")
node_modules_dir=$(get_dir_path "${project_dir}/node_modules/")
readme_path="${project_dir}/README.md"

if [[ $1 == '-v' ]] || [[ $1 == '--verbose' ]]; then
	echo "This Script: ${this_script}"
	echo "Scripts Dir: ${this_dir}"
	echo "Project Dir: ${project_dir}"
	echo "Node Modules Dir: ${node_modules_dir}"
fi


echo -n "Generating readme file at: ${readme_path}... "

node "${node_modules_dir}/jsdoc-to-markdown/bin.js" --files "${project_dir}/flat-line.js"  --separators | node "${node_modules_dir}/jsdoc2md-anchors/bin/jsdoc2md-anchors.js" > "${project_dir}/README.md"

if [[ $? -ne 0 ]]; then
	echo "Failed to create README file..."
else
	echo "Done"
fi