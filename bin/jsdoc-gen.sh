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
docs_root="${project_root}/docs"
node_modules_path=$(get_dir_path "${project_root}/node_modules/")
jsdoc_bin="${node_modules_path}/jsdoc/jsdoc.js"
readme_path="${project_root}/README.md"

if [[ $1 == '-v' ]] || [[ $1 == '--verbose' ]]; then
	echo "This Script: ${this_script}"
	echo "Scripts Dir: ${this_dir}"
	echo "Project Root: ${project_root}"
	echo "Node Modules Path: ${node_modules_path}"
fi

node "${jsdoc_bin}" --configure "${this_dir}/jsdoc-conf.json"