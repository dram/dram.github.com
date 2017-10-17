Title: 去除NetBSD终端下的橙色高亮

终端下，NetBSD会在一些地方用橙色作为高亮，这样眼睛看久了会不舒服。而且VIM下的一些color scheme也会出现偏差。在网上找了好久，发现应该是在termcap的问题。经过试验，得出如下方法。

编辑`/usr/share/misc/termcap`，找到以`vt220`开头的行，然后将这一项中的`ue=\E[24m`和`us=\E[4m`这两个选项删除，别忘了对应的冒号（记得做备份哦，出问题了别来找我:P），然后保存退出。其实这两个选项是处理下划线的，NetBSD用橙色高亮取代下划线了。

再在`/usr/share/misc/`目录下，利用`cap_mkdb termcap`来生成`termcap.db`文件，同样，最好先备份原来的termcap.db文件。

或者也可以将相关项放在~/.termcap里。 

