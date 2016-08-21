#!/bin/bash

# build node
cp -vR src/ public/ && \
# build chrome
cp -vR src/ chrome/ && \
# zip chrome
zip -r ext.zip chrome
