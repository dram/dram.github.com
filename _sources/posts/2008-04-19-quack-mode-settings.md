Title: Quack-mode的一些设置

    (setq quack-pltcollect-dirs '("/usr/lib/plt/collects" "/usr/share/plt"))

Debian下好像doc并没有放在/usr/lib/plt/collects中，所以需要设置一下quack-pltcollect-dirs。

    (setq quack-local-keywords-for-remote-manuals-p nil)

这个选择可以让quack先搜索本地的keywords文档。

    (setq quack-fontify-style 'emacs)

Quack自己定义了一套色彩方案，大概是仿照DrScheme的，但不是很喜欢，可以通过上面的选项设置默认使用Emacs的配色。
