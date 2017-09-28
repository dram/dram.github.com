Title: VIM & Lisp & Screen配合使用

主要需要完成的功能就是在VIM中将代码（比如一个defun）通过screen传到另一窗口的程序（比如SBCL）中执行。

之前用过一个通过python-pexpect来包装sbcl，再通过pipe传入的脚本，也是比较方便的。但那里的包装代码看起来比较复杂，而这个用screen的方法比较简洁。

当然，这方法不是我想出来的。:P，我只是稍微修改了一下。参考了下面两篇文章：

- [Like Slime, for Vim][1]
- [Scripting screen for fun and profit...][2]

方法很简单，用screen建一个名为sbcl的窗口，然后将下面的代码放到~/.vim/ftplugin/lisp.vim中。（下面的代码同时也贴出了其他一些Lisp的设置和按键绑定）。之后\rr可以求值一个表达式，而\rx则是load当前buffer。 

    setl expandtab
    setl shiftwidth=1
    setl foldmethod=indent
    setl foldnestmax=1
    "setl lispwords=def,mac,fn,with,when,if

    nmap  [[ [(
    nmap  ]] ])
    nmap  [{ 99[(
    nmap  [} 99])
    nmap  == 99[(=%

    nmap    rr      :call VimLisp_eval_defun()
    nmap    rx      :call VimLisp_send_sexp("(load \"" . expand("%:p") . "\")\n")

    fun! VimLisp_send_sexp(sexp)
           let ss = escape(a:sexp, '\"')
           call system("screen -p sbcl -X stuff \"" . ss . "\n\"")
    endfun

    fun! VimLisp_eval_defun()
           let pos = getpos('.')
           silent! exec "normal! 99[(yab"
           call VimLisp_send_sexp(@")
           call setpos('.', pos)
    endfun

当然，这是一个通用的方法，完全可以使用到其他一些语言的interpreter上。

   [1]: http://technotales.wordpress.com/2007/10/03/like-slime-for-vim/
   [2]: http://www.jerri.de/blog/archives/2006/05/02/scripting_screen_for_fun_and_profit/
