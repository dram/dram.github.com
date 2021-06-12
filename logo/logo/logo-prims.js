/*
Copyright (c) 2011, Xin Wang
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict"

globals.globals = Self.clone(prototypes.env)
globals.word_list = Self.clone(prototypes.word_list)

;(function () {
    var word

    word = Self.clone(prototypes.prim_word)
    word.name = 'sum'
    word.narg = 2
    word.func = function (arg) {
        var expr = prototypes.number.clone(0)
        for (var i = 0; i < arguments.length; ++i)
            expr.value += arguments[i].value
        return expr
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'add'
    word.narg = 2
    word.func = function (n1, n2) {
        return prototypes.number.clone(n1.value + n2.value)
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'minus'
    word.narg = 2
    word.func = function (n1, n2) {
        return prototypes.number.clone(n1.value - n2.value)
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'lt'
    word.narg = 2
    word.func = function (n1, n2) {
        return prototypes.boolean.clone(n1.value < n2.value)
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'gt'
    word.narg = 2
    word.func = function (n1, n2) {
        return prototypes.boolean.clone(n1.value > n2.value)
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'eq'
    word.narg = 2
    word.func = function (n1, n2) {
        return prototypes.boolean.clone(n1.value == n2.value)
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'multiple'
    word.narg = 2
    word.func = function (n1, n2) {
        return prototypes.number.clone(n1.value * n2.value)
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'divide'
    word.narg = 2
    word.func = function (n1, n2) {
        return prototypes.number.clone(n1.value / n2.value)
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'print'
    word.narg = 1
    word.func = function (val) {
        var rec = function (val) {
            var text = ""

            switch (val.type) {
            case 'INTEGER':
                text += val.value.toString()
                break
            case 'LIST':
                text = "[" +
                            val.items.map(function (item) {
                                return rec(item)
                            }).join(" ") + "]"
                break
            case 'BRACKET-WORD':
                text += val.text
                break
            default:
                text = val.toString()
            }

            return text
        }

        var trans = document.getElementById('Transcript')

        if (trans) {
            var text = rec(val)

            trans.value += (text + "\n")
            trans.scrollTop = trans.scrollHeight
        }
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'repeat'
    word.narg = 2
    word.func = function (times, block, env, cont, expr) {
        var rec = function (n, block) {
            var cps = Self.clone(prototypes.cps)
            cps.expr = expr

            cps.next = function (c) { return block.value(env, c) }
            cps.continuation = function (v) {
                if (n > 1)
                    return rec(n - 1, block)
                else
                    return cont(v)
            }

            return cps
        }

        return rec(times.value, block)
    }
    globals.word_list.$add(word)

    word = Self.clone(prototypes.prim_word)
    word.name = 'ifelse'
    word.narg = 3
    word.func = function (test, then_block, else_block, env, cont, expr) {
        var cps = Self.clone(prototypes.cps)

        var block = test.value ? then_block : else_block

        cps.next = function (c) { return block.value(env, c) }
        cps.expr = expr
        cps.continuation = cont

        return cps
    }
    globals.word_list.$add(word)
})()
