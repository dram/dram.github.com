Title: 学习Python: __str__和__repr__

在翻Python for Unix and Linux System Administration这本书时，作者在IPython部分讲到了`__str__和__repr__`，非常详细，清晰。

下面是是那本书上的例子： 

    >>> class DoubleRep(object):
    ...     def __str__(self):
    ...         return "a __str__"
    ...     def __repr__(self):
    ...         return "a __repr__"
    ...
    >>> dr = DoubleRep()
    >>> print dr
    a __str__
    >>> dr
    a __repr__
    >>> "%s" % dr
    'a __str__'
    >>> "%r" % dr
    'a __repr__'

相信无需解释。

再贴上Python文档上的说明：

    __str__( self) Called by the str() built-in function and by the print
    statement to compute the ``informal'' string representation of an object.
    This differs from __repr__() in that it does not have to be a valid Python
    expression: a more convenient or concise representation may be used instead.
    The return value must be a string object. __repr__( self) Called by the repr()
    built-in function and by string conversions (reverse quotes) to compute the
    ``official'' string representation of an object. If at all possible, this
    should look like a valid Python expression that could be used to recreate an
    object with the same value (given an appropriate environment). If this is not
    possible, a string of the form "" should be returned. The return value must be
    a string object. If a class defines __repr__() but not __str__(), then
    __repr__() is also used when an ``informal'' string representation of instances
    of that class is required. This is typically used for debugging, so it is
    important that the representation is information-rich and unambiguous.

