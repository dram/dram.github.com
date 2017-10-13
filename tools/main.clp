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
                 ;; U::read-lines
                 read-lines (create$)))
  (foreach ?file ?files
    (bind ?date (sub-string (+ (str-length ?*post-directory*) 1)
                            (+ (str-length ?*post-directory*) 10)
                            ?file))

    (assert (post ?file
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
  (bind ?target (str-cat ?*output-directory*
                         (sub-string 2 (str-length ?uri) ?uri)))

  (if (= (U::run-process /usr/bin/test (create$ ?source -nt ?target)) 0)
   then
     (U::run-command (U::make-command python3
                                      (create$ "tools/sam/samparser.py"
                                               ?source))

                     (U::make-command xsltproc
                                      (create$ --stringparam date ?date
                                               "stylesheets/sam-article.xsl"
                                               "-"))
                     (U::make-command xsltproc
                                      (create$ --output ?target
                                               "stylesheets/main.xsl"
                                               "-")))))

(defrule find-page-sources
 =>
)

(reset)

(run)

(exit)
