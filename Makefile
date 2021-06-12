CLASSPATH=classes:$(shell echo tools/dita-ot-3.6.1/lib/* | tr " " ":")

export CLASSPATH

.PHONY: build default format serve shell

default: serve

build: classes/Build.class
	java Build

format:
	java -jar tools/google-java-format-1.10.0-all-deps.jar --replace tools/*.java

serve: classes/Build.class classes/Serve.class
	java Serve

shell:
	jshell tools/Build.java

classes/%.class: tools/%.java
	javac -d classes $^
