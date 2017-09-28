Title: Slackware下驱动罗技V320

V320的中键还有向左向右点击的功能，Windows下可以通过简单的安装SetPoint来设置，而在Linux则需要一些设置。

其实并不麻烦，只需将下面这段代码加到`/etc/X11/xorg.conf`中即可。

    Section "InputDevice"
    Identifier "Mouse0"
    Driver "evdev"
    Option "Device" "/dev/input/event1"
    Option "Name" "Logitech USB Receiver"
    Option "HWHEELRelativeAxisButtons" "7 6"
    EndSection

当然，首先你需要安装xf86-input-evdev包。

另外/dev/input/event1可以需要做一些尝试，如event0, event1, event2等。

这样就可以在xev中检测到点击事件了。

接下来需要作的事就是在你的WM中对键进行设置。比如在Openbox就是用Button6，Button7来表示这两个按键的。

另外，你还可以通过xmodmap对按键进行调整。比如V320的中间比较难按，而Linux经常需要用他来粘贴，可以通过如下命令将中间向下按与向左按交换。

    xmodmap -e "pointer = 1 7 3 4 5 6 2"

