; find all sources
; (assert (page source output-path))

(defmodule MAIN)

(defglobal ?*page-directory* = "_sources/pages/")
(defglobal ?*post-directory* = "_sources/posts/")
(defglobal ?*output-directory* = "./")

(deffunction get-modification-time (?path)
  (bind ?o (tcl-new-string-obj ?path))
  (bind ?stat (tcl-alloc-stat-buf))
  (tcl-incr-ref-count ?o)
  (bind ?r (tcl-fs-stat ?o ?stat))
  (tcl-decr-ref-count ?o)
  (if (= ?r 0)
   then (tcl-get-modification-time-from-stat ?stat)
   else -1))

(defrule create-tcl-interpeter
 =>
  (assert (tcl (tcl-create-interp))))

(defrule find-post-sources
  (tcl ?tcl)
 =>
  (tcl-eval-ex ?tcl
               (tcl-merge (create$ "glob" "-path" ?*post-directory* "*.sam"))
               /)

  (foreach ?file (tcl-split-list ?tcl (tcl-get-string-result ?tcl))
    (bind ?date (sub-string (+ (str-length ?*post-directory*) 1)
                            (+ (str-length ?*post-directory*) 10)
                            ?file))

    (assert (post (str-cat ?file)
                  (str-cat "/blog/"
                           (sub-string 1 4 ?date)
                           "/"
                           (sub-string 6 7 ?date)
                           "/"
                           (sub-string 9 10 ?date)
                           "/"
                           (sub-string (+ (str-length ?*post-directory*) 12)
                                       (- (str-length ?file) 4)
                                       ?file)
                           ".html")
                  creation-date ?date))))

(defrule generate-post-html
  (tcl ?tcl)
  (post ?source ?uri creation-date ?date)
 =>
  (bind ?target (str-cat ?*output-directory*
                         (sub-string 2 (str-length ?uri) ?uri)))

  (if (> (get-modification-time ?source) (get-modification-time ?target))
   then
     (tcl-open-command-channel
      ?tcl
      (create$ "python3"
               "tools/sam/samparser.py" ?source
               "|" "xsltproc"
               "--stringparam" "date" ?date "stylesheets/sam-article.xsl" "-"
               "|" "xsltproc"
               "--output" ?target "stylesheets/main.xsl" "-")
      /)))

(defrule find-page-sources
 =>
)

(reset)

(run)

(exit)
