#
# Makefile
#

default: pelican

.PHONY: pelican sphinx serve clean

pelican:
	pelican -s pelicanconf.py

reload:
	pelican -r -s pelicanconf.py

serve:
	python3 -m http.server

publish:
	- git branch -D master
	git co -b master
	make
	git add index.html blog/ logo/*.html
	git ci -m "Published."
	git push -f origin master
	git co sources

generate:
	tools/unnamed -f2 tools/main.clp

tools:
	make PLATFORM=Linux -C tools/clips libclips.a main.o
	make PLATFORM=Linux -C tools unnamed

clean:
	make -C tools/clips clean
	make -C tools clean-unnamed
