/*
Copyright (c) 2011, Xin Wang
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict"

;(function () {
    var word

    word = Self.clone(prototypes.prim_word)
    word.name = 'forward'
    word.narg = 1
    word.func = function (n) {
        var orig = new paper.Point(globals.turtle.position)
        var path = new paper.Path()

        path.style = {
            strokeColor: 'black',
            strokeWidth: 4
        }

        path.opacity = 0.3

        globals.turtle.position.x += Math.sin(globals.heading) * n.value
        globals.turtle.position.y -= Math.cos(globals.heading) * n.value

        if (globals.pen_down) {
            path.moveTo(orig)
            path.lineTo(globals.turtle.position)
        }

        paper.view.draw()
    }
    globals.word_list.$add(word)


    word = Self.clone(prototypes.prim_word)
    word.name = 'penup'
    word.narg = 0
    word.func = function (n) { globals.pen_down = false }
    globals.word_list.$add(word)


    word = Self.clone(prototypes.prim_word)
    word.name = 'pendown'
    word.narg = 0
    word.func = function (n) { globals.pen_down = true }
    globals.word_list.$add(word)


    word = Self.clone(prototypes.prim_word)
    word.name = 'right'
    word.narg = 1
    word.func = function (n) {
        globals.heading += n.value * Math.PI / 180
        globals.turtle.rotate(n.value)
        paper.view.draw()
    }
    globals.word_list.$add(word)


    word = Self.clone(prototypes.prim_word)
    word.name = 'left'
    word.narg = 1
    word.func = function (n) {
        globals.heading -= n * Math.PI / 180
        globals.turtle.rotate(- n.value)
        paper.view.draw()
    }
    globals.word_list.$add(word)

    ;['forward'
      , 'right'
      , 'penup'
      , 'pendown'
      , 'repeat'
      , 'ifelse'].forEach(function (word) {
	if (globals.keywords && globals.keywords[word])
	    globals.word_list.$add_alias(word, globals.keywords[word])
    })

    globals.init_drawing_area = function () {
        globals.turtle = new paper.Path()
        globals.turtle.moveTo(new paper.Point(0, 0))
        globals.turtle.lineTo(new paper.Point(6, -8))
        globals.turtle.lineTo(new paper.Point(12, 0))
        globals.turtle.position =
            new paper.Point(globals.canvas.width / 2 - 300,
                            globals.canvas.height / 2)
        globals.turtle.strokeColor = 'black'
        globals.turtle.strokeWidth = 3
        globals.turtle.scale(1, 1)
        globals.heading = 0
        globals.pen_down = true
    }
})()
