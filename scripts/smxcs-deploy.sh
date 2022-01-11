#!/usr/bin/env bash
zipFile=smxcs.zip
destFolder=~/www/smxcs
rm -rf $destFolder/* && cp $zipFile $destFolder/ && cd $destFolder && unzip $zipFile && rm $zipFile && cd ~