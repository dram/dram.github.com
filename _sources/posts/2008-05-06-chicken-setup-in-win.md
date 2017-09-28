Title: win下使用chicken-setup

首先当然是要安装好MinGW开发环境，chicken只是将Scheme源文件转成C，真正的编译还是要由gcc来做。而在安装各种egg时，大部分都需要用到编译。

之后需要建立一个环境变量`CHICKEN_PREFIX`，指向chicken的安装目录。如D:/chicken/。这一步很重要，因为chicken-setup在运行时，需要通过这个环境变量来指定csc的路径。但按文档说如果在PATH中能找到csc就不使用`CHICKEN_PREFIX`的，但我这不成功。 还有就是tar, gzip这两个工具，我是安装了GnuWin32，Chicken的README中提到可以使用UnxUtils。

另外，如果你使用的是官方的预编译版本，就不要在Cygwin中使用chicken-setup，因为chicken-setup是直接调用gcc来编译的，如果在Cygwin中运行，则会使用Cygwin的gcc，而不是MinGW中的了。 
