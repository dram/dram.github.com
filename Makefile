default: generate

.PHONY: generate serve publish clean

generate:
	clips-tcl -f2 tools/main.clp

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
	rm -r index.html blog/ logo/*.html
