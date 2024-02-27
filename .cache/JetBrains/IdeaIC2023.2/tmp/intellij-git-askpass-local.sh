#!/bin/sh
"/opt/intellij-idea-community/jbr/bin/java" -cp "/opt/intellij-idea-community/plugins/vcs-git/lib/git4idea-rt.jar:/opt/intellij-idea-community/lib/externalProcess-rt.jar" git4idea.http.GitAskPassApp "$@"
