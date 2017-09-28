Title: queue.h 中的链表实现

在编写 C 程序时，很多情况下都会用到链表这一数据结构，虽然简单，但是很容易出错。而且自己编写时一般都不考虑代码复用的问题，链表的代码混杂在其它代码中，如果在其它地方再用到链表，又要重新实现一遍。

其实链表可以在网上找到很多，glibc 也包含了一个 queue.h，这是从 BSD 中移植过来的。queue.h 中包含各种链表还有队列，都是以宏方式实现的。glibc 中的种类比较少，可以到 NetBSD 中找到更加全面的 [版本][1] 。再可以看看它的 [文档][2] ，里面有一些简单的例子。不过最好是看看它的代码，在理解了之后使用时才不大会出错。

要了解 queue.h 的实现，这篇 [文章][3] 不错。 

[1]: http://cvsweb.netbsd.org/bsdweb.cgi/src/sys/sys/queue.h
[2]: http://netbsd.gw.com/cgi-bin/man-cgi?queue++NetBSD-current
[3]: http://freebsdchina.org/forum/viewtopic.php?t=37913

