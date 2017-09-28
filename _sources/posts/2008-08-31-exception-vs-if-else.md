Title: 异常vs.判断

这两天python-list上有条关于什么时候用异常的讨论线索，[在这][1]。

不长，稍微整理了一下。

几个缩写语： 

  * EAFP: Easier to ask forgiveness than permission
  * LBYL: Look before you leap
  * DFTCFE: Don't forget to check for errors

异常的一些好处：

    try:
        x = 3 / y
    except ZeroDivisionError:
        x = 0

    if y != 0:
        x = 3 / y
    else:
        x = 0

如果除以0的操作出现得不频繁的话，速度上异常会快一点，因为它少了一步判断操作。

    if os.path.exists(filename):
        f = open(filenmae)

上面的代码中，在if判断和open函数打开文件之间，可能文件被删除，从这一点上说，异常更加保险。

如果我们乘坐google这架时光机器，我们还可以去旁听一下2003年的那场[讨论][2]。

如果耐心看下去，你会看到如下代码，哈。

    try:
        igniteKerosene()
    except ExplosionError:
        handleExplosionCase()

   [1]: http://www.gossamer-threads.com/lists/python/python/675364
   [2]: http://mail.python.org/pipermail/python-list/2003-May/205182.html

