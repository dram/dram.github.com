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

clean:
	-rm -rf notes/*
