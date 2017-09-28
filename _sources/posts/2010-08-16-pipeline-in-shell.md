Title: SHELL中的pipeline

相信对Linux稍有了解的人对pipeline（管道）都会非常熟悉。而我对于下面描述的现象却一直没有足够重视。

当处理一个大文件时，比如tmp.log，`cat tmp.log | head -10`要比`cat tmp.log >/dev/null`快许多。这里哪个程序在起作用呢？是cat，head还是这个pipeline机制？

在浏览了cat和head的代码后，确认它们没有对这一块做特殊处理。应该是与pipeline有关。在翻阅pipe及write的manual之后，大致可以对这一现象作如下解释：

在执行`cat tmp.log | head -10`时，cat程序的标准输出与head的标准输入以pipe相连。head在读取完10行之后程序退出，导致pipe中的reading end被关闭，这时cat在继续写入pipe时会产生SIGPIPE信号，该信号的默认处理方式是终止程序。另外，pipe的缓存是有限的，所以即使cat运行快于head，由于缓存的限止，cat后续的写动作会被block，直到reader端读取了数据，缓存再次出现空闲。所以由于head只需要读取10行数据，cat不可能写入太多数据到pipe，从而也不会从tmp.log中读取大量数据。在Wikipedia中[对此][1]有比较详细的说明。

可以通过写两个简单的测试程序来证实。一个producer和一个consumer，两者由pipeline连接，producer不断写，而consumer不读取，这样在producer中的write会被block。在producer中捕捉SIGPIPE，让conumer先于producer退出，producer会出现SIGPIPE。 

[1]: http://en.wikipedia.org/wiki/SIGPIPE
