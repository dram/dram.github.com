/*
Copyright (c) 2011, Xin Wang
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict"

var Self = {}

Self.clone = function (obj)
{
    if (typeof (obj) !== "object") {
        return obj
    } else if (Array.isArray(obj)) {
        return obj.concat()
    } else {
        var nu = Object.create(Object.getPrototypeOf(obj), {})

        Object.getOwnPropertyNames(obj).forEach(function (name) {
            Object.defineProperty(
                nu,
                name,
                Object.getOwnPropertyDescriptor(obj, name))
        })

        return nu
    }
}

Self.add_child = function (obj, child)
{
    obj.$children.push(child)
}

Self.trait = function (parents, props)
{
    var obj = Self.clone(props)
    var traits = [obj]

    parents.forEach(function (p) {
        traits = traits.concat(p.$traits)
    })

    Object.defineProperties(obj, {
        $parents: { value: Self.clone(parents), enumerable: false },
        $children: { value: [], enumerable: false },
        $traits: { value: traits, enumerable: false }
    })

    Self.update_slots(obj)

    obj.$parents.forEach(function (p) { Self.add_child(p, obj) })

    return obj
}

Self.hastrait = function (obj, traits)
{
    if (typeof obj !== "object" || obj === null || !obj.$traits)
        return false

    return traits.some(function (trait) {
        return obj.$traits.indexOf(trait) != -1
    })
}

Self.prototype = function (trait, props)
{
    var obj = Object.create(trait, {})

    Object.getOwnPropertyNames(props).forEach(function (name) {
        obj[name] = props[name]
    })

    return obj
}

Self.get_trait = function (obj)
{
    if (typeof obj !== "object" || obj === null)
        return undefined
    else
        return Object.getPrototypeOf(obj)
}

Self.add_slot = function (obj, name, val)
{
    obj[name] = val

    obj.$children.forEach(function (child) {
        Self.update_slots(child)
    })
}

Self.update_slots = function (obj)
{
    obj.$parents.forEach (function (p) {
        Object.getOwnPropertyNames(p).forEach(function (name) {
            if (!obj.hasOwnProperty(name)) {
                Object.defineProperty(
                    obj,
                    name,
                    Object.getOwnPropertyDescriptor(p, name))
            }
        })
    })

    obj.$children.forEach(function (child) {
        Self.update_slots(child)
    })
}
