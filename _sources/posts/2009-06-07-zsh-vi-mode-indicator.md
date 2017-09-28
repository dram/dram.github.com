Title: zsh vi 模式提示

习惯了 vi 按键的，相信都有在 shell 下使用 vi 模式的经历。而不能提示当前编辑模式则是大部分 shell vi 模式的一个致命伤。

对于 zsh，没有发现并不代表不存在，[zshwiki][1] 里有一个简单的例子，下面的代码在它的基础上稍作加工，以不同的提示符颜色指示当前是 insert 还是 normal 模式。 

    function zle-line-init zle-keymap-select {
    	VIMODE="${${KEYMAP/vicmd/32}/(main|viins)/0}"
    	zle reset-prompt
    }

    if [ ${ZSH_VERSION%.?} != "4.2" ]
    then
    	zle -N zle-line-init
    	zle -N zle-keymap-select
    fi

    setopt prompt_subst
    PS1=$'%{\e[32m%}%~%{\e[31m%}%(0?..%?)%{\e[${VIMODE}m%}%#%{\e[0m%} '

[1]: http://zshwiki.org/home/examples/zlewidgets

