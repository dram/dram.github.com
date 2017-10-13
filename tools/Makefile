unnamed: unnamed.o clips/main.o
	gcc -s -o $@ $^ $(UNNAMED_OBJS) -lm

include clips/makefile

UNNAMED_OBJS = $(patsubst %, clips/%, $(filter-out userfunctions.o, $(OBJS)))

unnamed.o: unnamed.c

.PHONY: clean-unnamed generate-unnamed

clean-unnamed:
	rm -f unnamed unnamed.o

generate-unnamed:
	clips-unnamed-compiler . \
		call-with-input-file call-with-input-process \
		call-with-output-process create-directory \
		create-temporary-directory read-contents read-lines \
		remove-directory replace-substring run-command run-process
