#!/bin/bash

# build node
cp -vr src/* public/ && \
# build chrome
cp -vr src/* chrome/ && \
# zip chrome
zip -r ext.zip chrome