Title: 递归与递代

对一个问题的求解，递归与递代是两个全然不同的思维方式，递归是自上而下的，而递代则是自下而上的。而两者的联系也是非常紧密，在将递归计算过程转化为递代时，可以以递归的调用过程作为基础进行递代结构设计。以下用几个例子加以说明。

以对 `2^n` 的求解说明线性递归转化为递代的思路。根据 `2^n = 2 * 2^(n-1)` 及 `2^0 = 1` ，用Scheme实现的递归代码如下： 

    (define (expt-2 n)
      (if (= n 0)
        1
        (* 2 (expt-2 (- n 1))))

比如计算 `(expt-2 3)` 的函数调用过程如下：

    (expt-2 3)
    (* 2 (expt-2 2))
    (* 2 (* 2 (expt-2 1)))
    (* 2 (* 2 (* 2 (expt-2 0))))
    (* 2 (* 2 (* 2 1)))
    (* 2 (* 2 2))
    (* 2 4)
    8

而当用自下而上的递代方式考虑这问题时，依然可以从递推公式 `2^n = 2 * 2^(n-1)` 中下手。

    (expt-2 0) => 1
    (expt-2 1) => 2 * (expt-2 0)
    (expt-2 2) => 2 * (expt-2 1)
    ...

    (define (expt-2 n)
      (define (iter product n)
        (if (= n 0)
          product
          (iter (* product 2) (- n 1))))
      (iter 1 n))

而明显的不同是，虽然从最终的运算顺序来看，都是先计算 `(expt-2 0)` ，再是 `(expt-2 1)` ，直到 `(expt-2 n)` ，但两者的函数调用顺序是不同的，递归在函数调用栈中临时保存了计算过程，所以它可以以自上而下的方式运算，下层调用的结果为上层调用使用，这里的中间值就可以用函数返回值来传递。而递代中，为解决递归中保存中间计算过程所带来的性能问题，需要以自下而上的方式组织运算，这样上层调用的结果被下层调用使用，这样中间值必需通过参数传递。

从以上的讨论中可以看出，设计递归和递代的出发点是相似的，都从问题的递推公式出发。递归更接近平时的思维逻辑，而将递归转为递代的一个关键是上一层调用需要准备好所有需要的值，通过参数和临时变量传递过下一层。

两者的另一点不同是，由于递归和递代都是嵌套调用，都需要考虑如何判定结束。递归中可以通过判定递推的起点。而递代中由于是从递推的起点开始计算，所以需要通过其它方式判定。 

以下再以Fibonacci及Hanoi为例，说明对于较复杂递归转递代的处理。

以下是SICP中Fibonacci的递归与递代实现。

    (define (fib n)
      (cond ((= n 0) 0)
            ((= n 1) 1)
            (else (+ (fib (- n 1))
                     (fib (- n 2)))))

    (define (fib n)
      (fib-iter 1 0 n))

    (define (fib-iter a b count)
      (if (= count 0)
          b
          (fib-iter (+ a b) a (- count 1))))

Fibonacci的递推公式为 `fib(n) = fib(n-1) + fib(n-2)` ，根据上面的讨论，设计递代，主要抓住两点，一是上层调用为下层调用准备好所有需要的值，也就是 `fib(n-1)` 和 `fib(n-2)` ，对应于代码中的a和b。第二点是如何判断递代结束，这里是通过count计数递代次数。

再来看Hanoi的问题：

    (define (hanoi n)
      (define (rec disk-num source-pole dest-pole spare-pole)
        (cond ((= disk-num 1) (list (list source-pole dest-pole)))
              (else (append
                      (rec (- disk-num 1)
                           source-pole
                           spare-pole
                           dest-pole)
                      (rec 1 source-pole dest-pole '())
                      (rec (- disk-num 1)
                           spare-pole
                           dest-pole
                           source-pole)))))
      (rec n 'a 'b 'c))

    (define (hanoi-list num from to spare)
      (define (iter n table)
        (define (hash key)
          (let ((val (assoc key table)))
            (if val (cadr val) '())))
        (cond ((= n 0) table)
              (else (iter (- n 1)
                          (list (list (list from to)
                                      (append (hash (list from spare))
                                              (list (list from to))
                                              (hash (list spare to))))
                                (list (list from spare)
                                      (append (hash (list from to))
                                              (list (list from spare))
                                              (hash (list to spare))))
                                (list (list to from)
                                      (append (hash (list to spare))
                                              (list (list to from))
                                              (hash (list spare from))))
                                (list (list to spare)
                                      (append (hash (list to from))
                                              (list (list to spare))
                                              (hash (list from spare))))
                                (list (list spare from)
                                      (append (hash (list spare to))
                                              (list (list spare from))
                                              (hash (list to from))))
                                (list (list spare to)
                                      (append (hash (list spare from))
                                              (list (list spare to))
                                              (hash (list from to)))))))))
      (iter num '()))

    (define (hanoi-2 n from to spare)
      (let ((lst (hanoi-list (- n 1) from to spare)))
        (append (cadr (assoc (list from spare) lst))
                (list (list from to))
                (cadr (assoc (list spare to) lst)))))

同样，对于Hanoi问题，关键还是两点，Hanoi的递推思路是先移到n-1个盘到spare柱，再移动最下面的盘到to柱，最后将spare中的n-1个盘移到to柱。这样对于下一层递代调用来说，需要上一层准备将n-1盘从from移动到spare及从spare移动到to的步骤。由于在不同层次，from, to, spare的角色会相互替换，所以上一层调用需要准备和将n-1个盘在3个柱之间移动的所有6种情况的步骤。而递代的结束通过n来计数递代调用层次。
