Title: Pharo和Squeak中的Closure

Smalltalk支持Closure，Squeak是不完全支持，而Pharo中则加入了完全的Closure支持。不过最新的Squeak trunk中也加入了完全Closure的支持。看了挺多资料，但都说得不是很清楚，最是[这篇][1]文章讲的浅显易懂。

但他的例子稍显复杂，而且在Pharo中也跑不起来。我这里来一个简单的： 

    adder := [:base | [:n | base + n]].

    add_one := adder value: 1.
    Transcript show: (add_one value: 2); cr; endEntry.

    add_ten := adder value: 10.
    Transcript show: (add_ten value: 2); cr; endEntry.

    Transcript show: (add_one value: 2); cr; endEntry.

如果是支持full closure的话，结果应该是3, 12, 3，而如果只是部分支持，则是3, 12,
12。从这个例子中应该可以看出，完全和不完全就要是对block参数的处理。不完全closure共用了参数base。

另一个区别是，支持full closure的支持递归地调用block，下面是Squeak trunk中的一个例子。

    fac := [:n| n > 1 ifTrue:[n * (fac value: n-1)] ifFalse:[1]].
    fac value: 5.

而在Squeak中，则是直接报错了。

[1]: http://lists.squeakfoundation.org/pipermail/squeak-dev/1999-November/025166.html

