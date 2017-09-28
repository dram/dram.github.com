Title: Haskell 中的字符串处理

注：以前在其他地方写的笔记，现在重新开始学习 Haskell，所以先搬过来。 

## split 和 join

相信各位如果学过 Python 的话，对于这两个函数必定是非常熟悉了。但在 Haskell 中并没有具有同样功能的函数，相似的还是有的。

首先是 words 和 lines 函数，它们的名字已很能说明问题了，words 用来 split 以空格分隔的字符串，lines 则是 split 以 '\n' 分隔的字符串。

这两个函数用来简单的 split 已经够用了，如果不能满足要求那么就试试 Text.Regex.splitRegex，这个就和 split 差不多了，且功能强大的多，因为可以使用正则表达式了。来个简单的例子。

    import Text.Regex

    main = print $ splitRegex (mkRegex ", ") "one, two, three"

另外有相对应的 unwords 和 lines 函数来充当 join 的功能。如果还想插入空格和换行之外的东西，可以使用 intersperse 函数。

    import Data.List

    main = print $  concat . intersperse ".." $ ["one", "two", "three"]

当然，定义一个 join 函数也是非常容易的。

    join :: [a] -> [[a]] -> [a]
    join d = concat . intersperse d

## 切片

Python 非常迷人的一个功能应该就是切片了，用起来非常方便。而 Haskell 中也还好，有 take, drop 系列函数，可以完成常用的一些功能。

take 用来取得 list 前面的几个元素，而 drop 则丢弃前面的几个元素。比如： 先我们可以来定义一个 takeTail 函数，还有一个 slice，其中的 slice 与 Python 稍有不同，我是参考 Lua，将第二个参数作为返回字符串的长度处理，且计数是从 1 开始的：

    takeTail :: Int -> [a] -> [a]
    takeTail n lst = let len = length lst in drop (len - n) lst

    slice :: Int -> Int -> [a] -> [a]
    slice s len = drop (s-1) . take (s-1+len)
    take 3 "hello"      --> "hel"
    drop 3 "hello"      --> "lo"
    takeTail 3 "hello"  --> "llo"
    slice 1 3 "hello"   --> "hel"

上面都是比较常规的截取字符串的方法，Haskell 中还提供给我们两个函数：takeWhile 和 dropWhile，它可以由你指定判断标准，遍历列表的各个元素（String 中这是每个 Char），并取得相应的符合条件的一段 list。还是直接看例子吧：

    takeWhile (/='.') "hello.world"     --> "hello"
    dropWhile (/='.') "hello.world"     --> ".world"

## find 和 replace

上面的功能可以在通用的 list 函数中找到答案，但 find 和 replace 则不好办了，如果只是找 Char 没问题，但找 String 的话则要用 Text.Regex.matchRegex 和 subRegex 了。

## 网络资源

- [A split function in Haskell][1] -- 一篇博客文章，里面的回复也挺有价值的。
- [Haskell's Standard List Functions][2] -- 这篇文章按功能将标准 list 函数分了下类，看一看会很受启发。
- [Text.Regex Library][3] -- Text.Regex 的文档。

   [1]: http://julipedia.blogspot.com/2006/08/split-function-in-haskell.html
   [2]: http://www.cs.chalmers.se/Cs/Grundutb/Kurser/d1pt/d1pta/ListDoc/
   [3]: http://www.haskell.org/ghc/docs/latest/html/libraries/regex-compat/Text-Regex.html
