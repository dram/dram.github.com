; find all sources
; (assert (page source output-path))

(defmodule U
  (export deffunction ?ALL))

(load* "tools/unnamed.clp")

(defmodule MAIN)

(defglobal ?*page-directory* = "_sources/pages/")
(defglobal ?*post-directory* = "_sources/posts/")
(defglobal ?*output-directory* = "./")

(defglobal ?*temporary-directory* = nil)

(deffunction generate-temporary-filename ()
  (str-cat ?*temporary-directory* / (gensym*)))

(defrule create-temporary-directory
  (declare (salience 100))
 =>
  (bind ?*temporary-directory*
    (U::create-temporary-directory "/tmp/clips.XXXXXX")))

(defrule remove-temporary-directory
  (declare (salience -100))
 =>
  (U::remove-directory ?*temporary-directory*))

(defrule find-post-sources
 =>
  (bind ?files (U::call-with-input-process
                   find (create$ ?*post-directory* -name "*.sam")
                 read-lines (create$)))
  (foreach ?file ?files
    (bind ?date (sub-string (+ (str-length ?*post-directory*) 1)
                            (+ (str-length ?*post-directory*) 10)
                            ?file))

    (assert (post (U::call-with-input-file ?file
                    read-contents (create$))
                  (str-cat "/blog/"
                           (U::replace-substring ?date "-" "/")
                           "/"
                           (sub-string (+ (str-length ?*post-directory*) 12)
                                       (- (str-length ?file) 4)
                                       ?file)
                           ".html")
                  creation-date ?date))))

(defrule generate-post-html
  (post ?source ?uri creation-date ?date)
 =>
  (U::call-with-output-process
      python3 (create$ "tools/sam/samparser.py"
                       -outfile
                       (bind ?content-xml (generate-temporary-filename))
                       "/dev/stdin")
    printout (create$ ?source))

  (U::run-process xsltproc
                  (create$ --output
                           (bind ?content-html (generate-temporary-filename))
                           --stringparam
                           date
                           (U::call-with-input-process
                               date (create$ "+%d %b %Y" -d ?date)
                             readline (create$))
                           "stylesheets/sam-article.xsl"
                           ?content-xml))

  (U::run-process xsltproc
                  (create$ --output
                           (str-cat ?*output-directory*
                                    (sub-string 2 (str-length ?uri) ?uri))
                           --stringparam
                           current-year
                           (U::call-with-input-process
                               date (create$ "+%Y")
                             readline (create$))
                           "stylesheets/main.xsl"
                           ?content-html)))

(defrule find-page-sources
 =>
)

(reset)

(watch facts)

(run)

(exit)
