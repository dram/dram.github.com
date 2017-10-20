(defglobal ?*page-directory* = "_sources/pages/")
(defglobal ?*post-directory* = "_sources/posts/")
(defglobal ?*output-directory* = "./")

(defglobal ?*tcl* = (tcl-create-interp))

(deffunction tcl ($?arguments)
  (bind ?argument-objs (tcl-new-obj))
  (foreach ?argument ?arguments
    (tcl-list-obj-append-element ?*tcl*
                                 ?argument-objs
                                 (tcl-new-string-obj ?argument)))
  (if (eq (bind ?result
            (tcl-eval-objv ?*tcl*
                           (tcl-list-obj-get-elements ?*tcl*
                                                      ?argument-objs)
                           /))
          /ok/)
   then (tcl-get-obj-result ?*tcl*)
   else (tcl-write-obj (tcl-get-std-channel /stderr/)
                       (tcl-get-return-options ?*tcl* ?result))
        FALSE))

(deffunction tcl/s ($?arguments)
  (if (bind ?result (tcl (expand$ ?arguments)))
   then (tcl-get-string ?result)))

(deffunction tcl/m ($?arguments)
  (if (bind ?result (tcl (expand$ ?arguments)))
   then (tcl-split-list ?*tcl* (tcl-get-string ?result))))

(deffunction run-process ($?command)
  (tcl-close ?*tcl* (tcl-open-command-channel ?*tcl* ?command /)))

(deffunction call-/-process (?command ?function-call ?flags)
  (bind ?channel (tcl-open-command-channel ?*tcl*
                                           ?command
                                           ?flags))
  (bind ?result (funcall (nth$ 1 ?function-call)
                         ?channel
                         (expand$ (rest$ ?function-call))))
  (tcl-close ?*tcl* ?channel)
  ?result)

(deffunction read-line (?channel)
  (bind ?obj (tcl-new-obj))
  (if (= -1 (tcl-gets-obj ?channel ?obj))
   then FALSE
   else (tcl-get-string ?obj)))

(deffunction read-lines (?channel)
  (bind ?lines (create$))
  (while (bind ?line (read-line ?channel))
    (bind ?lines ?lines ?line))
  ?lines)

(deffunction get-modification-time (?path)
  (bind ?o (tcl-new-string-obj ?path))
  (bind ?stat (tcl-alloc-stat-buf))
  (tcl-incr-ref-count ?o)
  (bind ?r (tcl-fs-stat ?o ?stat))
  (tcl-decr-ref-count ?o)
  (if (= ?r 0)
   then (tcl-get-modification-time-from-stat ?stat)
   else -1))

(defrule find-post-sources
 =>
  (foreach ?file (tcl/m "glob" "-path" ?*post-directory* "*.sam")
    (bind ?date (sub-string (+ (str-length ?*post-directory*) 1)
                            (+ (str-length ?*post-directory*) 10)
                            ?file))

    (assert (post ?file
                  (str-cat "/blog/"
                           (tcl/s "string" "map" "- /" ?date)
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

  (if (> (get-modification-time ?source) (get-modification-time ?target))
   then
     (run-process "python3"
                  "tools/sam/samparser.py" ?source
                  "|" "xsltproc"
                  "--stringparam" "date" ?date
                  "stylesheets/sam-article.xsl" "-"
                  "|" "xsltproc"
                  "--output" ?target "stylesheets/main.xsl" "-")))

(defrule find-page-sources
 =>
  (foreach ?file (call-/-process (create$ "find"
                                          ?*page-directory* "-name" "*.sam")
                                 (create$ read-lines)
                                 /stdout/)
    (assert (page (str-cat ?file)
                  (str-cat (sub-string (str-length ?*page-directory*)
                                       (- (str-length ?file) 4)
                                       ?file)
                           ".html")))))

(defrule generate-page-html
  (page ?source ?uri)
 =>
  (bind ?target (str-cat ?*output-directory*
                         (sub-string 2 (str-length ?uri) ?uri)))

  (if (> (get-modification-time ?source) (get-modification-time ?target))
   then
     (run-process "python3"
                  "tools/sam/samparser.py" ?source
                  "|" "xsltproc"
                  "stylesheets/sam-article.xsl" "-"
                  "|" "xsltproc"
                  "--output" ?target "stylesheets/main.xsl" "-")))

(reset)

(run)

(exit)
