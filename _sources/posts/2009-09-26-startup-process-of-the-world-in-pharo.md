Title: Pharo的World以及启动流程

Squeak的桌面有个很特别的名字，world，点击左键，就会出现world菜单。Squeak的world其实也是一个Morph，具体说来，是PasteUpMorph，相当于一个容器，可以包含其它Morph，甚至是其它World，所以在一个image中，world并不是唯一的。

有两个全局变量与world相关，一个是World，另一个是ActiveWorld。Object有一个currentWorld消息，当有ActiveWorld时，返回它，否则返回World，那究竟World和ActiveWorld有什么关系呢？那应该去看看Pharo的启动过程。

然而，Pharo的启动流程有些特别，具体的流程可以看[这里][1]和[这里][2]。由于Pharo是用image的形式存放整个环境的，Pharo的启动其实就只是恢复到上次保存时的状态，而完全不需要对World，ActiveWorld之类的变量进行初始化。

找到的一个与World相关的操作是`PasteUpMorph class>>startUp`，这是在启动过程中需要调用的，但这里没有对World的初始化操作。只是恢复之前保存的World的一些动作。

但image第一次生成的时候会有哪些操作呢？不清楚。

而直接从代码上找，可以找到这些相关消息，`Project>>initMorphic`, `ProjectLauncher>>startUp`, `Proejct>>enter`, `PasteUpMorph>>enter`, `PasteUpMorph>>install`，但还不清晰，有待进一步研究。 

[1]: http://lists.squeakfoundation.org/pipermail/beginners/2006-October/001172.html
[2]: http://lists.squeakfoundation.org/pipermail/beginners/2006-October/001177.html

