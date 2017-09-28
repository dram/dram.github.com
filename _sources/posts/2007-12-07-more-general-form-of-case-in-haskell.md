Title: Haskell 中 case 的更一般形式

注：以前在其他地方写的笔记，现在重新开始学习 Haskell，所以先搬过来。

Haskell 在函数定义时可以使用 pattern matching 和 guards，而在函数内部则可以用 case。在大部分教程中讲的 case 都是一种特殊形式，即作为 pattern matching 来介绍的。然而如果我们在函数内部需要类似 guards 的功能时就感觉有些无能为力了。其实 case 语句已经包含了这一功能。在 The Haskell 98 Language Report 的 [3 Expressions][1] 中已经作了说明。下面就以 SICP 中 1.3.3 节的寻找方程根的函数 search 为例： 

      search f negp posp =
          if S.closeEnough negp posp 0.0001
             then midp
             else case f midp of
                       x  | x == 0    -> midp
                          | x >  0    -> search f negp midp
                          | x  search f midp posp
        Where       midp    = (negp + posp) / 2

可以看到其实它的语法还是非常直观的，就是在每个 pattern 之后还可以加 guards。而我们平时使用 case 时都是一种特殊形式。如：

      case n of
           1  -> 3
           n  -> 4

就等价于：

     case n of
           1 | True   -> 3
           n | True   -> 4

   [1]: http://www.haskell.org/onlinereport/exps.html

