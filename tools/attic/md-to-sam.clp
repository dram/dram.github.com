(defglobal ?*tcl* = (tcl-create-interp))

(deffunction map$ (?function ?fields)
  (bind ?results (create$))
  (foreach ?field ?fields
    (bind ?results ?results (funcall ?function ?field))))

(deffunction tcl ($?arguments)
  (if (eq /ok/ (bind ?r (tcl-eval-objv ?*tcl*
                                       (map$ tcl-new-string-obj ?arguments)
                                       /)))
   then (tcl-get-obj-result ?*tcl*)
   else (printout stderr
                  (tcl-get-string (tcl-get-return-options ?*tcl* ?r)))))

(deffunction tcl/s ($?command)
  (tcl-get-string (tcl (expand$ ?command))))

(deffunction tcl/m ($?command)
  (tcl-split-list ?*tcl* (tcl-get-string (tcl (expand$ ?command)))))

(deffunction run-process (?command)
  (tcl-close ?*tcl* (tcl-open-command-channel ?*tcl* ?command /)))

(deffunction parse-links (?file)
  (bind ?links (create$))
  (open ?file f)
  (while (neq (bind ?line (readline f)) EOF)
    (bind ?links
      ?links (rest$ (tcl/m "regexp" "-inline"
                           "\\[([0-9]+)\\]:\\s(.+)" ?line))))
  (close f)
  ?links)

(deffunction update-file (?source ?links)
  (open ?source source)
  (bind ?target (tcl/s "regsub" "(.+).md$" ?source "\\1.sam"))
  (run-process (create$ "git" "mv" ?source ?target))
  (open (str-cat ?target ".1") target "w")
  (while (neq (bind ?line (readline source)) EOF)
    (bind ?line (tcl/s "regsub" "^[tT]itle:" ?line "article:"))
    (if (neq 1 (str-index "article:" ?line))
     then (bind ?line (str-cat "	" ?line)))
    (loop-for-count (?i (div (length$ ?links) 2)) 
      (bind ?id (nth$ (- (* ?i 2) 1) ?links))
      (bind ?link (nth$ (* ?i 2) ?links))
      (bind ?line (tcl/s "regsub"
                         (format nil "\\[([^\\[\\]]+?)\\]\\[%s\\]" ?id)
                         ?line
                         (format nil "{\\1}(%s)" ?link))))
    (bind ?line (tcl/s "regsub" "-line"
                       "!\\[([^\\[\\]]+?)\\]\\((.+)\\)"
                       ?line
                       ">>>(image \\2)(#\\1)"))
    (printout target ?line crlf))
  (close target)
  (close source)
  (run-process (create$ "mv" (str-cat ?target ".1") ?target)))

(deffunction main ()
  (while (neq (bind ?file (readline)) EOF)
    (bind ?links (parse-links ?file))
    (update-file ?file ?links)
    ))

(main)

(exit)
