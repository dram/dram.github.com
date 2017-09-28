Title: Squeak的sub-pixel

最近在玩Squeak，用的是Pharo。在用Squeak官方的VM时，字体的sub-pixel不能启用，使用Exupery的VM则可以。

原本以为是libfreetype库的问题，于是想着自己编译一遍VM，在下载VM source后发现源码中只是一个编译好的freetype.a库文件，而且没有打开sub-pixel。于是又去gnuwin32上下了一个freetype，那里的sub-pixel是默认打开的。但用这个替代VM source里的freetype.a后再重新编译，依然没有效果。

后来注意到，在使用Exupery VM时，只是替代了原来的Squeak.exe文件，而没有代替FT2Plugin.dll文件，所以应该不是freetype的问题。再在Exupery VMMaker的history中看到，exupery中增加了一个bitblt emulation，所以我所看到的sub-pixel不是freetype的功劳，而是由bitblt来完成的。 

