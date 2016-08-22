#!/bin/bash

# build node
cp -v src/* public/ && \
# build chrome
cp -v src/* chrome/ && \
# zip chrome
zip -r ext.zip chrome