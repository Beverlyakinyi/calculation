#!/bin/sh
"/opt/intellij-idea-community/jbr/bin/java" -cp "/opt/intellij-idea-community/lib/externalProcess-rt.jar" externalApp.nativessh.NativeSshAskPassApp "$@"
