Title: Squeak查找message

经常要用到查找message名这个功能，但每次都需要去World菜单里找，比较麻烦。有没有更为方便的方式？比如可以在Workspace里直接对字符串发送一个消息就可以打开这个窗口。或者Workspace菜单里或是什么快捷键可以完成这一功能。

先需要知道这个查找窗口的class name，可以通过窗口菜单中about功能得到。这个Morph是MessageNames，再就是在System Browser里看看这个class有些什么功能了，特别是要注意有些什么class messages。

这样就会找到一个相关的message methodBrowserSearchingFor:，再看看有哪些地方用到了它，像`StandardToolSet class>>browseMessageNames:`, `ToolSet class>>browseMessageNames:`, `SystemNavigation>>browseMethodsWhoseNamesContain:`, `ParagraphEditor>>methodNamesContainingIt`。

再去看看methodNamesContainingIt，会有一个惊喜的发现，其实Workspace里已经包含了这一功能，只是隐藏地比较深而已。那就是Shift+右键菜单，而快捷键是Alt+Shift+W。 

