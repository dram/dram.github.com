Title: Win下编译Chicken

由于想对Chicken的错误显示格式稍作调整，所以需要自己编译Chicken。

先是用cmd + MinGW来处理，编译通过，但安装时出现了问题，可能是由于Makefile里是用mkdir来新建文件夹，但在cmd下没有这个命令的原因。不想改Makefile，所以又安装了msys，编译、安装顺利进行，就下面两个命令就可以了：

    make PLATFORM=mingw-msys PREFIX=d:/chicken
    make PLATFORM=mingw-msys PREFIX=d:/chicken install
