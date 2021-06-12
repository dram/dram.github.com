/*
Copyright (c) 2011, Xin Wang
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict"

window.traits = {}
window.prototypes = {}

/*
  A CPS object have two attributes, NEXT and CONTINUATION. Everytime a
  CPS is executed, NEXT is called with its CONTINUATION as an
  argument, and it will return a value or another CPS.

  If NEXT is an atomic action, it will return a value directly, else
  if it have to call another CPS, than its own CONTINUATION should be
  passed through and return a new CPS will be returned.

  CONTINUATION always return a CPS or a end_cont indicates that has
  reach the end.
*/
traits.CPS = Self.trait([], {
    isCPS: function (obj) {
        return Self.hastrait(obj, [traits.CPS])
    },

    step: function () {
        var r = this.next(this.continuation)

        if (traits.CPS.isCPS(r))
            return r
        else
            return this.continuation(r)
    },

    end_cont: function (r) { console.log('end_cont'); return r }
})

prototypes.cps = Self.prototype(traits.CPS, {
    next: null,
    continuation: null,
    expr: null,
})

traits.Expr = Self.trait([], {
    eval_list_rec: function (data, env, final_cont) {
        var cps

        if (data.idx >= data.list.length) {
            return final_cont(data.list)
        } else {
            var expr = data.list[data.idx]

            if (expr.type == 'APPLY' || expr.type == 'INFIX') {
                cps = Self.clone(prototypes.cps)
                cps.expr = expr
                cps.next = function (c) { return expr.eval(env, c) }
                cps.continuation = function (r) {
                    data.list[data.idx] = r
                    data.idx += 1
                    return traits.Expr.eval_list_rec(data, env, final_cont)
                }
            } else {
                if (expr.type == 'VARIABLE' || expr.type == 'TO')
                    data.list[data.idx] = expr.eval(env)
                data.idx += 1
                cps = traits.Expr.eval_list_rec(data, env, final_cont)
            }
        }

        return cps
    },

    eval_list: function (list, env, final_cont) {
        var data = { list: Self.clone(list), idx: 0 }
        return traits.Expr.eval_list_rec(data, env, final_cont)
    },
})

traits.Nil = Self.trait([traits.Expr], {
    type: 'NIL',
    toString: function () { return 'NIL' },
    eval: function (env) { return this },
    clone: function (value) { return Self.clone(this) },
})

prototypes.nil = Self.prototype(traits.Nil, { })

traits.Boolean = Self.trait([], {
    type: 'BOOLEAN',

    toString: function () { return 'BOOLEAN' },

    eval: function (env) { return this },

    clone: function (value) {
        var obj = Self.clone(this)
	if (value !== undefined)
            obj.value = value
        return obj
    }
})

prototypes.boolean = Self.prototype(traits.Boolean, {
    value: null
})

traits.Number = Self.trait([traits.Expr], {
    type: 'NUMBER',

    toString: function () { return 'NUMBER' },

    eval: function (env) { return this },

    clone: function (value) {
        var obj = Self.clone(this)
	if (value || value === 0)
            obj.value = value
        return obj
    }
})

prototypes.number = Self.prototype(traits.Number, {
    value: null
})

traits.Symbol = Self.trait([], {
    type: 'SYMBOL',
})

prototypes.symbol = Self.prototype(traits.Symbol, {})

traits.Variable = Self.trait([traits.Expr], {
    type: 'VARIABLE',

    toString: function () { return 'VARIABLE' },

    clone: function (name) {
        var obj = Self.clone(this)
        obj.name = name || this.name
        return obj
    },

    eval: function (env) { return env[this.name] },
})

prototypes.variable = Self.prototype(traits.Variable, {
    name: null
})

traits.Word = Self.trait([], {
    toString: function () { return this.type }
})

traits.PrimWord = Self.trait([traits.Word], { type: 'PRIMITIVE' })

prototypes.prim_word = Self.prototype(traits.PrimWord, {
    name: null,
    narg: null,
    func: null
})

traits.DefWord = Self.trait([traits.Word], { type: 'DEFINED' })

prototypes.def_word = Self.prototype(traits.DefWord, {
    name: null,
    arg_names: null,
    block: null
})

traits.List = Self.trait([traits.Expr], {
    type: 'LIST',

    toString: function () { return 'LIST' },

    eval: function (env) { return this },

    clone: function () {
        var obj = Self.clone(this)
        obj.data = []
        return obj
    },

    value: function (env, final_cont) {
        return traits.Expr.eval_list(this.data, env, final_cont)
    },

    append: function (mem) {
        this.data.push(mem)
    },

    replace_child: function (old, nu) {
        nu = nu.clone()
        nu.parent = this

        var index = this.data.indexOf(old)

        if (index != -1) {
            this.data[index] = nu
	    return true
	} else {
	    return false
	}
    },

    delete_child: function (expr) {
        var index = this.data.indexOf(expr)

	if (index != -1) {
            this.data.splice(index, 1)
	    return true
	} else {
	    return false
	}
    },
})

prototypes.list = Self.prototype(traits.List, {
    data: null
})

prototypes.expr = Self.prototype(traits.Expr, { })

traits.ExprTo = Self.trait([traits.Expr], {
    type: 'TO',

    toString: function () { return "EXPR-TO" },

    clone: function (name) {
        var obj = Self.clone(this)
        obj.name = name
        obj.arg_names = []
        obj.block = prototypes.list.clone()
        return obj
    },

    eval: function (env, cont) {
        var word = Self.clone(prototypes.def_word)

        word.name = this.name
        word.arg_names = this.arg_names
        word.block = this.block

        globals.word_list.$add(word)
    }
})

prototypes.expr_to = Self.prototype(traits.ExprTo, {
    name: null,
    arg_names: null,
    block: null
})

traits.ExprApply = Self.trait([traits.Expr], {
    type: 'APPLY',

    toString: function () { return "EXPR-APPLY" },

    clone: function (name) {
        var obj = Self.clone(this)
	if (name)
            obj.name = name
        obj.args = []
	if (this.args)
	    for (var i = 0, l = this.args.length; i < l; ++i) {
		obj.args[i] = this.args[i].clone()
                obj.args[i].parent = obj
            }
        return obj
    },

    eval_with_args: function (args, env, final_cont) {
        var cont = null

        var word = globals.word_list[this.name]
        if (word.type === 'PRIMITIVE') {
            var that = this

            cont = function (r) {
                var res = word.func.apply(
                    null, r.concat(env, final_cont, that))
                if (traits.CPS.isCPS(res))
                    return res
                else
                    return final_cont(res)
            }
        } else {
            cont = function (r) {
                var new_env = Object.create(env, {})
                var names = word.arg_names
                for (var i = 0, l = names.length; i < l; ++i)
                    new_env[names[i]] = r[i]
                var cps = word.block.value(new_env, final_cont)
                return cps
            }
        }

        return traits.Expr.eval_list(args, env, cont)
    },

    eval: function (env, final_cont) {
        var cps = this.eval_with_args(this.args, env, final_cont)
        cps.expr = cps.expr || this
        return cps
    },

    replace_child: function (old, nu) {
        nu = nu.clone()
        nu.parent = this

        var index = this.args.indexOf(old)

        if (index != -1) {
            this.args[index] = nu
	    return true
	} else {
	    return false
	}
    },
})

prototypes.expr_apply = Self.prototype(traits.ExprApply, {
    name: null,
    args: null
})

traits.ExprInfix = Self.trait([traits.Expr], {
    type: 'INFIX',

    toString: function () { return "EXPR-INFIX" },

    clone: function (op) {
        var obj = Self.clone(this)
	if (op)
            obj.op = op
        if (this.left) {
            obj.left = this.left.clone()
            obj.left.parent = obj
        }
        if (this.right) {
            obj.right = this.right.clone()
            obj.right.parent = obj
        }
        return obj
    },

    eval_with_args: function (args, env, cont) {
        return traits.ExprApply.eval_with_args.call(this, args, env, cont)
    },

    eval: function (env, cont) {
        this.name = {
            '<': 'lt', '>': 'gt', '=': 'eq',
            '+': 'add', '-': 'minus', '*': 'multiple', '/': 'divide' }[this.op]

        var args = [this.left, this.right]

        return this.eval_with_args(args, env, cont)
    },

    replace_child: function (old, nu) {
        nu = nu.clone()
        nu.parent = this

        if (this.left === old) {
            this.left = nu
	    return true
        } else if (this.right === old) {
            this.right = nu
	    return true
	} else {
	    return false
	}
    }
})

prototypes.expr_infix = Self.prototype(traits.ExprInfix, {
    op: null,
    left: null,
    right: null
})

traits.ExprParen = Self.trait([traits.Expr], {
    type: 'PAREN',

    toString: function () { return "EXPR-PAREN" },

    clone: function (expr) {
        var obj = Self.clone(this)
        obj.expr = expr
        return obj
    }
})

prototypes.expr_paren = Self.prototype(traits.ExprParen, {
    expr: null
})

traits.Token = Self.trait([], {})

prototypes.token = Self.prototype(traits.Token, {
    type: null,
    text: null,
    line: null,
    toString: function () { return '[' + this.line + '] TOKEN: ' + this.text }
})

traits.Error = Self.trait([], {
    clone: function () { return Self.clone(this) }
})

traits.NameError = Self.trait([traits.Error], {
    toString: function () { return "NameError " + this.name },

    clone: function (name) {
        var obj = Self.clone(this)
        obj.name = name
        return obj
    }
})

prototypes.name_error = Self.prototype(traits.NameError, { name: null })

traits.SyntaxError = Self.trait([traits.Error], {
    toString: function () { return "SyntaxError" },

    clone: function (message, token) {
        var obj = Self.clone(this)
        obj.message = message
        obj.token = token
        return obj
    }
})

prototypes.syntax_error = Self.prototype(traits.SyntaxError, {
    message: null,
    token: null
})

traits.RuntimeError = Self.trait([traits.Error], {
    toString: function () { return "RuntimeError" },

    clone: function (expr) {
        var obj = Self.clone(this)
        obj.expr = expr
        return obj
    }
})

prototypes.runtime_error = Self.prototype(traits.RuntimeError, { expr: null })

traits.TokenList = Self.trait([], {})

prototypes.token_list = Self.prototype(traits.TokenList, {
    index: null,
    data: null,
    next: function () { return this.data[this.index++] },
    peek_next: function () { return this.data[this.index] },
    toString: function () { return 'TOKENLIST' }
})

traits.Env = Self.trait([], {})

prototypes.env = Self.prototype(traits.Env, {})

traits.WordList = Self.trait([], {
    $add: function (word) { this[word.name] = word },
    $add_alias: function (orig, alias) { this[alias] = this[orig] }
})

prototypes.word_list = Self.prototype(traits.WordList, {})

traits.Lang = Self.trait([], {
    trans_keyword: function (key) {
	if (globals.keywords && globals.keywords[key])
	    return globals.keywords[key]
	else
	    return key
    },

    tokenize: function (src) {
        var list = Self.clone(prototypes.token_list)
        var tokens = []
        var infix_ops = /[\+\-\*\/\=\<\>]/
        var spaces = /[ \t\n]/
        var non_space = /[^ \t\n]/
        var space_or_bracket = /[ \t\n\[\];]/
        var delimiters = /[ \t\n\[\]\(\);]|$/
        var delimiters_and_infix_ops = /[ \t\n\[\]\(\);\+\-\*\/\=\<\>]|$/
        var to_tokens = ['to', this.trans_keyword('to')]
        var end_tokens = ['end', this.trans_keyword('end')]
        var idx = 0
        var line = 0
        var chr = null
        var token = null

        while (src.length > 0) {
            idx = 0

            if ((idx = src.search(non_space)) == -1)
                break

            if (idx != 0) {
                line += src.slice(0, idx).split('\n').length - 1
                src = src.slice(idx)
                continue
            }

            if (src[0] == ';') {
                src = src.slice(src.search(/\n|$/))
                continue
            }

            token = Self.clone(prototypes.token)
            token.line = line

            chr = src[0]
            idx += 1

            switch (chr) {
            case '[':
                token.type = "BRACKET-OPEN"
                break
            case ']':
                token.type = "BRACKET-CLOSE"
                break
            case '(':
                token.type = "PAREN-OPEN"
                break
            case ')':
                token.type = "PAREN-CLOSE"
                break
            case '"':
                idx = src.search(delimiters)

                if (idx == -1)
                    idx = src.length

                token.type = "SYMBOL"
                break
            case ':':
                idx = src.search(delimiters_and_infix_ops)

                token.type = "VARIABLE"
                break
            default:
                if (chr.search(infix_ops) != -1) {
                    token.type = "INFIX-OP"
                } else {
                    idx = src.search(delimiters_and_infix_ops)

                    var sym = src.slice(0, idx).toLowerCase()

                    if (parseInt(sym, 10) == sym) {
                        token.type = 'NUMBER'
                    } else if (to_tokens.indexOf(sym) != -1) {
                        token.type = 'PROC-TO'
                    } else if (end_tokens.indexOf(sym) != -1) {
                        token.type = 'PROC-END'
                    } else {
                        token.type = 'WORD'
                    }
                }
            }

            token.text = src.slice(0, idx)
            tokens.push(token)
            src = src.slice(idx)
        }

        list.data = tokens
        list.index = 0

        return list
    },

    reorder_infix: function (expr) {
        var prios = { '<': 1, '>': 1, '+': 2, '-': 2, '*': 3, '/': 3 }

        switch (expr.type) {
        case 'APPLY':
            for (var i = 0; i < expr.args.length; ++i)
                expr.args[i] = this.reorder_infix(expr.args[i])
            break
        case 'INFIX':
            if (prios[expr.op] >= prios[expr.right.op]) {
                var right = expr.right
                var parent = expr.parent

                expr.right = right.left

                expr.left.parent = expr
                expr.right.parent = expr

                right.left = expr
                expr.parent = right

                expr = this.reorder_infix(right)
                expr.parent = parent
            } else {
                expr.right = this.reorder_infix(expr.right)
                expr.left.parent = expr
                expr.right.parent = expr
            }
            break
        case 'TO':
            expr.block = this.reorder_infix(expr.block)
            break
        case 'LIST':
            for (var i = 0; i < expr.data.length; ++i)
                expr.data[i] = this.reorder_infix(expr.data[i])
            break
        case 'PAREN':
            expr = this.reorder_infix(expr.expr)
            break
        }

        return expr
    },

    parse_expr: function (tokens, word_list, in_paren) {
        var expr = null
        var token = tokens.next()

        if (!token)
            throw prototypes.syntax_error.clone("no more token")

        switch (token.type) {
        case 'PAREN-OPEN':
            expr = prototypes.expr_paren.clone(this.parse_expr(tokens, word_list, true))

            if (tokens.next().type != 'PAREN-CLOSE')
                throw prototypes.syntax_error.clone("missing ')'", token)

            break
        case 'BRACKET-OPEN':
            expr = prototypes.list.clone()

            while (tokens.peek_next().type != 'BRACKET-CLOSE') {
                var e = this.parse_expr(tokens, word_list)
                e.parent = expr
                expr.append(e)
            }

            tokens.next() // discard 'BRACKET-CLOSE'
            break
        case 'PROC-TO':
            expr = prototypes.expr_to.clone(tokens.next().text)

            while ((token = tokens.peek_next()) && token.type == 'VARIABLE')
                expr.arg_names.push(tokens.next().text)

            // Add a fake word to temporary word list
            var word = Self.clone(prototypes.def_word)

            word.name = expr.name
            word.arg_names = expr.arg_names
            word.block = null

            word_list.$add(word)

            while (tokens.peek_next().type != 'PROC-END') {
                var e = this.parse_expr(tokens, word_list)
                e.parent = expr.block
                expr.block.append(e)
            }

            expr.block.parent = expr

            tokens.next() // discard 'PROC-END'
            break
        case 'NUMBER':
            expr = prototypes.number.clone(parseInt(token.text, 10))
            break
        case 'VARIABLE':
            expr = prototypes.variable.clone(token.text)
            break
        default:
            if (!(token.text in word_list))
                throw prototypes.name_error.clone(token)

            expr = prototypes.expr_apply.clone(token.text)

            var word = word_list[token.text]

            if (word.type == 'PRIMITIVE') {
                if (in_paren &&
                        ['sum', 'list'].indexOf(word.name) != -1) {
                    while (tokens.peek_next().type != 'PAREN-CLOSE') {
                        var e = this.parse_expr(tokens, word_list)
                        e.parent = expr
                        expr.args.push(e)
                    }
                } else {
                    for (var i = 0; i < word.narg; ++i) {
                        if (!tokens.peek_next())
                            throw prototypes.syntax_error.clone(
                                'missing argument(s)', token)

                        var e = this.parse_expr(tokens, word_list)
                        e.parent = expr
                        expr.args.push(e)
                    }
                }
            } else if (word.type == 'DEFINED') {
                for (var i = 0; i < word.arg_names.length; ++i) {
                    if (!tokens.peek_next())
                        throw prototypes.syntax_error.clone(
                            'missing argument(s)',token)

                    var e = this.parse_expr(tokens, word_list)
                    e.parent = expr
                    expr.args.push(e)
                }
            }
        }

        if (tokens.peek_next() && tokens.peek_next().type == 'INFIX-OP') {
            token = tokens.next()
            var e = prototypes.expr_infix.clone(token.text)

            e.left = expr

            if (!tokens.peek_next())
                throw prototypes.syntax_error.clone(token)

            var right = this.parse_expr(tokens, word_list)
            e.right = right

            expr = e
        }

        expr.line = token.line

        return expr
    },

    parse: function (tokens) {
        var all = []
        // temporary word list used for parsing
        var word_list = Object.create(globals.word_list, {})

        while (tokens.peek_next()) {
            var expr = this.parse_expr(tokens, word_list)

            expr = this.reorder_infix(expr)

            all.push(expr)
        }

        return all
    },

    eval: function (tokens, env) {
        var res = null
        var exprs = this.parse(tokens)

        for (var i = 0; i < exprs.length; ++i) {
            var expr = exprs[i]

            var cps = expr.eval(env, traits.CPS.end_cont)

            if (!cps || traits.CPS.isCPS(cps))
                continue

            while ((cps = cps.step()) && traits.CPS.isCPS(cps))
                ;
        }

        return res
    },

    _: function () {
        var fmt = arguments[0]
        var args = [].slice.call(arguments, 1)

	fmt = globals.error_messages[fmt] || fmt

        return fmt.replace(/{(\d+)}/g, function (match, num) {
            return args[num] === undefined ? match : args[num]
        })
    },

    step: function () {
        var cps = globals.cps

        if (cps && traits.CPS.isCPS(cps)) {
            globals.cps = cps.step()
            if (traits.CPS.isCPS(globals.cps)) {
                globals.current_expression = globals.cps.expr
                return true
            }
        }

        return false
    },

    run_expr: function (exprs, logger) {
        try {
            var cps = traits.Expr.eval_list(
                exprs, globals.globals, traits.CPS.end_cont)

            globals.cps = cps
        } catch (e) {
            if (Self.hastrait(e, [traits.SyntaxError])) {
                logger.error(this._("SyntaxError: {0}", this._(e.message)))
                if (e.token) {
                    logger.error(this._("  Line {0}: {1}",
                                        e.token.line, lines[e.token.line]))
                }
            } else if (Self.hastrait(e, [traits.NameError])) {
                logger.error(this._("NameError: {0}", e.name))
            } else if (Self.hastrait(e, [traits.RuntimeError])) {
                logger.error(this._("RuntimeError: '{0}'", e.message))
                if (e.expr) {
                    logger.error(this._("  Line {0}: {1}",
                                        e.expr.line, lines[e.expr.line]))
                }
            } else {
                throw e
            }
        }
    },

    run: function (source, logger) {
        var lines = source.split('\n')
        try {
            var tokens = this.tokenize(source)
            this.eval(tokens, globals.globals)
        } catch (e) {
            if (Self.hastrait(e, [traits.SyntaxError])) {
                logger.error(this._("SyntaxError: {0}", this._(e.message)))
                if (e.token) {
                    logger.error(this._("  Line {0}: {1}",
                                        e.token.line, lines[e.token.line]))
                }
            } else if (Self.hastrait(e, [traits.NameError])) {
                logger.error(this._("NameError: {0}", e.name))
            } else if (Self.hastrait(e, [traits.RuntimeError])) {
                logger.error(this._("RuntimeError: '{0}'", e.message))
                if (e.expr) {
                    logger.error(this._("  Line {0}: {1}",
                                        e.expr.line, lines[e.expr.line]))
                }
            } else {
                throw e
            }
        }
    },

    export_expr: function (expr) {
	var src = ''

	switch (expr.type) {
	case 'TO':
	    src += [ this.trans_keyword('to'),
                     expr.name ].concat(expr.arg_names).join(' ') + "\n"
	    src += expr.block.data.map(globals.lang.export_expr).join(' ')
	    src += this.trans_keyword('end') + "\n"
	    break
	case 'APPLY':
	    src += [ expr.name ].concat(
                expr.args.map(globals.lang.export_expr)).join(' ')
	    src += "\n"
	    break
	case 'INFIX':
	    if (expr.left.type != 'INFIX')
		src += globals.lang.export_expr(expr.left)
	    else
		src += "(" + globals.lang.export_expr(expr.left) + ")"
	    src += " " + expr.op + " "
	    if (expr.right.type != 'INFIX')
		src += globals.lang.export_expr(expr.right)
	    else
		src += "(" + globals.lang.export_expr(expr.right) + ")"
	    break
	case 'PAREN':
	    src += "(" + globals.lang.export_expr(expr.expr) + ")"
	    break
	case 'NUMBER':
	    src += expr.value
	    break
	case 'VARIABLE':
	    src += expr.name
	    break
        case 'LIST':
	    src += "[ " + expr.data.map(function (e) {
		return globals.lang.export_expr(e)
	    }).join(" ") + " ]\n"
            break
	default:
	}

	return src
    },
})

prototypes.lang = Self.prototype(traits.Lang, {})

globals.lang = Self.clone(prototypes.lang)
