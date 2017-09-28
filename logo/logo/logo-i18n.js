/*
Copyright (c) 2011, Xin Wang
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict"

window.globals = {}

globals.locale = (navigator.language || navigator.browserLanguage).toLowerCase()

globals.tile_labels = {
    'zh-cn': {
	'TO': '定义',
	'list': '列表',
	'number': '数值',
	'start': '开始',
	'stop': '停止',
	'pause': '暂停',
	'continue': '继续',
	'step': '单步',
	'step(s) per second': '步/秒',
	'source': '代码',
	'forward': '前进',
	'right': '右转',
	'repeat': '重复',
	'penup': '抬笔',
	'pendown': '下笔',
        "ifelse": "是否",
	'+': '加',
	'-': '减',
	'*': '乘',
	'/': '除',
	'<': '小于',
	'>': '大于',
	'=': '等于',
	'name arg1 arg2': '名称 参数1 参数2',
	'OK': '确定',
	'Cancel': '取消',
	'Save': '保存',
    }
}[globals.locale]

globals.error_messages = {
    "zh-cn": {
	"SyntaxError: {0}": "语法错误: {0}",
	"missing 'END'": "缺少词 '结束'",
	"  Line {0}: {1}": "　　第 {0} 行: {1}",
	"RuntimeError: '{0}'": "运行时错误: {0}",
	"NameError: {0}": "名称错误: {0}",
    }
}[globals.locale]

globals.keywords = {
    "zh-cn": {
	"to": "定义",
	"end": "结束",
	"forward": "前进",
	"right": "右转",
	"penup": "抬笔",
	"pendown": "下笔",
        "repeat": "重复",
        "ifelse": "是否",
    }
}[globals.locale]

globals.sample = {
    "zh-cn": "\
定义 主程序\n\
结束\n\
主程序",
}[globals.locale]

if (!globals.sample)
    globals.sample = "\
to main\n\
end\n\
main"

globals.main_word_name = {
    "zh-cn": "主程序",
}[globals.locale]

if (!globals.main_word_name)
    globals.main_word_name = "main"
