#!/bin/bash

set -e

if [ $# -eq 0 ]; then
    echo "Usage $0 VERSION"
    exit 1
fi

echo "Bumping versions to $1"

# GNU/BSD compat
sedi=(-i)
case "$(uname)" in
  # For macOS, use two parameters
  Darwin*) sedi=(-i "")
esac

# Insert version number into package.json
pushd ../website
git grep -l $(cat ../VERSION) -- 'package.json' | \
    xargs sed "${sedi[@]}" \
    -e "s/\"version\": \"$(cat ../VERSION)\"/\"version\": \"$1\"/g"
yarn
popd

# Insert version number into CHANGELOG.md
sed "${sedi[@]}" -e "s/## \[Unreleased\]/## [Unreleased]\n\n## [$1] - $(date '+%Y-%m-%d')/g" ../CHANGELOG.md

echo $1 > ../VERSION

echo "$(git diff --stat | tail -n1) files modified"