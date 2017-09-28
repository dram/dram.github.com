Title: 查找 errno 相关信息

在 Linux 下编程，肯定是要和 errno 打交道的，而且常常是如下的情景： 

1. 一些系统函数出错，基本上当时都是用 perror() 来输出错误信息的。
2. 错误信息太过抽象，无法理解，google 之。
3. 搜索的结果有些杂乱，需要一个比较精确的关键词。
4. 把 perror() 换成 fprintf() 和 strerror()，同时打印出 errno 值。
5. 在 errno.h 中找到相应的宏名，以此作为关键词。

对于无聊的重复劳动往往会产生厌烦心理，那么有没有一劳永逸的方法呢？ 一番摸索后发现，可以用如下脚本列出系统的所有 errno 及相关信息。

    #!/bin/env python

    import errno
    import os

    if __name__ == '__main__':
        for key in sorted(errno.errorcode.keys()):
            print '%4s%16s  %s' % (key, errno.errorcode[key], os.strerror(key))

把结果保存到文件中，之后就可以用 grep 来方便地查找了。

