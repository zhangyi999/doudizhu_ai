# 斗地主 AI

19年腾讯上斗地主用户保有量 1.3 亿，市场量庞大，这个项目希望做一个策略预测机器人，作为工具给广大用户使用。

求路过大神给予指教。

## 简单思路

1. 编码
2. 确定大小对比规则
3. 完成给定范围内的特定牌型的克制组合
4. 收集牌型概率

### 编码

```js
/**
    0 -> 不出牌
    1 -> 3
    2 -> 4
    3 -> 5
    ...
    8 -> 10
    9 -> J
    a -> Q
    b -> K
    c -> A
    d -> 2
    e -> Sw 小王
    f -> Bw 大王
*/
const pokerType = ['J','Q','K','A','2','Sw','Bw']
const getPoint = core => core === 0 ? 0 : core < 9 ? core + 2 : pokerType[ core - 9 ]

const parsePoint = core => core === 0 ? '0' : core === '2' ? 2 : core < 9 ? core - 2 : pokerType.indexOf(core) + 9

```

### 确定大小对比规则

```js
// 单张

// f > e > 2 > 1 > c >> 3 > 0

function sort( cardArr = [] ) {

}

```