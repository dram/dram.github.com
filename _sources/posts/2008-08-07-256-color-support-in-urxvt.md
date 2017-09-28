Title: 给URxvt加入256色支持

以前一直不知道，原来默认URxvt只能支持88色，只有在打了patch之后才能支持256色。而那个patch其实已经随URxvt的源码一起发布了，藏在doc文件夹中。

我们要做的就是在`configure`之前先patch一下：

    patch -p1 < urxvt-8.2-256color.patch

之后按正常的步骤编译、安装即可。

    ./configure
    make
    make install

让URxvt支持256色的一大好处是原先在Teminal下VIM的那些难看的配色现在要顺眼多了。:-)

具体的差别可以查看这篇Blog:

[ rxvt-unicode 256 color support with vim][1]

另外如果要让screen支持256色，需要在`.screenrc`中加入：

    terminfo rxvt-unicode 'Co#256:AB=\E[48;5;%dm:AF=\E[38;5;%dm'

可能你还需要重新编译screen加入`--enable-colors256`。

最后，来一张截图，用的color scheme是[xterm16][2]。

[图][3]

   [1]: http://www.void.gr/kargig/blog/2008/06/27/rxvt-unicode-256-color-support-with-vim/
   [2]: http://www.vim.org/scripts/script.php?script_id=795
   [3]: http://danran.72pines.com/files/2008/08/2008-08-07-195646_566x447_scrot.png (xterm16)

