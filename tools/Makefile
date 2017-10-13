unnamed: unnamed.o clips/main.o
	gcc -s -o $@ $^ $(UNNAMED_OBJS) -lm

include clips/makefile

UNNAMED_OBJS = $(patsubst %, clips/%, $(filter-out userfunctions.o, $(OBJS)))

unnamed.o: unnamed.c

.PHONY: clean-unnamed generate-unnamed

clean-unnamed:
	rm -f unnamed unnamed.o

generate-unnamed: main.clp
	clips-unnamed-compiler . $(shell grep -hoP 'U::\K(\S+)' $^ | sort -u)
