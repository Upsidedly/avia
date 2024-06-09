#!/bin/bash

bun format

if [[ -n $(git status --porcelain) ]]; then
  git add .
  git commit -m "chore: format"
  git push
else
  echo "No changes to commit."
fi
