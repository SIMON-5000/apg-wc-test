#!/usr/bin/env bash
#
# Bash script to run lighthouse on a component.
# Use `lhtest <page name>`
#

if [[ "$1" = "modal" || "$1" = "checkbox" || "$1" = "combobox" ]]; 
then
    name=$1
    npx lighthouse "http://localhost:5001/${name}.html" \
    --preset=desktop \
    --only-categories=accessibility \
    --output html \
    --output json \
    --output csv \
    --output-path "./test-results/lighthouse/${name}"

    echo "***** TESTS FINISHED ******"
    exit 0
else
    echo "Invalid component name, use modal, combobox or checkbox"
    exit 1
fi
