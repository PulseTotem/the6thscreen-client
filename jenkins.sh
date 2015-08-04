#!/usr/bin/env bash

if [ -z $1 ]
then
  echo "Give path for core-client directory."
  exit 1
fi

if [ -z $2 ]
then
  echo "Give path for core directory."
  exit 1
fi

currentDir=`pwd`
cd $1
absolutePathClient=`pwd`
cd $currentDir
cd $2
absolutePathCore=`pwd`
cd $currentDir

npm install
echo '{ "coreClientRepoPath" : "'absolutePathClient'", "coreRepoPath": "'$absolutePathCore'" }' > core-repos-config.json
grunt initJenkins
grunt test --verbose