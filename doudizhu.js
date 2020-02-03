// 排列组合

// 两个数组全排列
function A( plen, nlen ) {
    const Alist  = []
    for ( let i = 0 ; i < plen ; i ++ ) {
        for ( let i1 = 0 ; i1 < nlen ; i1 ++ ) {
            Alist.push([ i, i1 ])
        }
    }
    return Alist
}

// 两个数组组合
function C( plen, nlen ) {
    const Alist  = []
    for ( let i = 0 ; i < plen ; i ++ ) {
        for ( let i1 = 0 ; i1 < nlen ; i1 ++ ) {
            i !== i1 ? Alist.push([ i, i1 ]) : ''
        }
    }
    return Alist
}

// 自组合 [0,1] = [1,0]
function C1( plen ) {
    const Alist  = []
    for ( let i = 0 ; i < plen ; i ++ ) {
        for ( let i1 = i ; i1 < plen ; i1 ++ ) {
            i !== i1 ? Alist.push([ i, i1 ]) : ''
        }
    }
    return Alist
}

const pokerType = ['J','Q','K','A','2','S','B']

// 编码转牌面
const getPoint = core => core === 0 ? 0 : core < 9 ? String( core*1 + 2 ) : pokerType[ core - 9 ];
const getPoints = coreArr => coreArr.map( v => getPoint(v)).join('')

// 牌面转编码
const parsePoint = card => (
    card === 0 ? '0' : card === '1' ? 8 : card === '2' ? 0xd : card <= 9 ? card - 2 : pokerType.indexOf(card) + 9
)
const parsePoints = coreStr => ( 
    coreStr = coreStr.replace('10',/1/g),
    coreStr.split('').map( v => parsePoint(v))
)

// 牌面排序
function sortCards( arr ) {
    return getPoints( parsePoints( arr ).sort( (a,b) => b - a ) )
}

// 整理牌型 输入 [1,2,3,4,5] 输出 [{ core: 编码, num: 数量 }] 
function getPokerCount( pokersArr, filerFun ) {
    const len = pokersArr.length
    const combination = []
    const diff = {}
    for ( let i = 0 ; i < len ; i++ ) {
        const v = pokersArr[i]
        diff[v]?diff[v] = diff[v] + 1 : diff[v] = 1
    }
    for ( let k in diff ) {
        const v = diff[k]
        const f = filerFun?filerFun(k*1,v):null
        f ? 
            combination.push(f):
            filerFun ?
                '':
                combination.push({
                    core: k,
                    num: v
                })
    }
    return combination
}

function ArrToCountObj( Arr ) {
    const diff = {}
    const len = Arr.length
    for ( let i = 0 ; i < len ; i++ ) {
        const v = Arr[i]
        diff[v]?diff[v] = diff[v] + 1 : diff[v] = 1
    }
    return diff
}

function prasePokerCountToArr( pokersObj ) {
    const d = []
    for( let k in pokersObj ) {
        d.push(... new Array(pokersObj[k]).fill(k*1))
    }
    return d
}

// 处理牌面，输入 [1,2,3,4,5] 输出 { cardType: 牌型, cardTypeWeight: 主牌牌面大小, groupCardsWeight: 组合权重 }
// 牌类型（DAN_TIAO, DUI_ZI, SAN_TIAO, SAN_DAI_YI, SAN_DAI_YI_DUI, SI_DAI_SHAUNG_DAN, FEI_JI_DAI_DAN, SI_TIAO_DAI_SHUANG_DUI, FEI_JI_DAI_DUI, DAN_SHUN_ZI, SAN_SHUN_ZI, SHUANG_SHUN_ZI, ZHA_DAN, WANG_ZHA）
function getPokerType( pokersArr ) {

    const arrLength = pokersArr.length
    // if ( len === 1 ) return cardType( pokerType.danzhang, pokersArr[0], 1 )
    // pokersArr = pokersArr.sort( (a,b) => b - a )

    const dictionaryItems = {}
    for ( let i = 0 ; i < arrLength ; i++ ) {
        const v = pokersArr[i]
        dictionaryItems[v] ? 
            dictionaryItems[v] = dictionaryItems[v] + 1 : 
            dictionaryItems[v] = 1
    }

    let cardMaxNum = 0, // 同权重牌最多张的有几张
    muchCardWeight // 最多牌的牌权重数
    for (let card in dictionaryItems) {
        if (dictionaryItems[card] >= cardMaxNum) {
            cardMaxNum = dictionaryItems[card]
            muchCardWeight = card * 1
        }
    }

    const arr = pokersArr.sort( (a,b) => a - b)
    switch (cardMaxNum) {
        case 1: // 单条（1）、王炸（2）、单顺子（5-12）
            if (arrLength === 1) {
                return { // 单条
                    cardType: 'DAN_TIAO',
                    cardTypeWeight: 1,
                    groupCardsWeight: arr[0],
                    cardMaxNum
                }
            } else if (arr[0] === 14 && arr[1] === 15) {
                return { // 王炸
                    cardType: 'WANG_ZHA',
                    cardTypeWeight: 3,
                    groupCardsWeight: 1,
                    cardMaxNum
                }
            } else if (arrLength >= 5 && arrLength <= 12) {
                // 顺子最大只能到A
                if (arr[arrLength - 1] <= 12) {
                    // 最大权重减最小权重加1 等于数组长度，则为单顺子
                    if (arr[arrLength - 1] - arr[0] + 1 === arrLength) {
                        return { // 单顺子
                            cardType: 'DAN_SHUN_ZI',
                            cardTypeWeight: 1,
                            groupCardsWeight: arr[arrLength - 1],
                            cardMaxNum
                        }
                    }
                    return false
                }
                return false
            } else {
                return false
            }
        case 2: // 对子（2）、双顺子（6-16）
            if (arrLength === 2) {
                return { // 对子
                    cardType: 'DUI_ZI',
                    cardTypeWeight: 1,
                    groupCardsWeight: arr[0],
                    cardMaxNum
                }
            } else if (arrLength >= 6 && arrLength <= 16 && arrLength % 2 === 0) {
                // 判断数组去重后是否构成顺子（至少3张顺子）
                var simpleArr = arr.filter(function (value, index, self) {
                    return self.indexOf(value) === index
                })
                if (simpleArr.length * 2 !== arrLength) {
                    return false
                }
                // 顺子最大只能到A
                if (arr[arrLength - 1] <= 12) {
                    if (simpleArr[simpleArr.length - 1] - simpleArr[0] + 1 === simpleArr.length) {
                        return { // 双顺子
                            cardType: 'SHUANG_SHUN_ZI',
                            cardTypeWeight: 1,
                            groupCardsWeight: arr[arrLength - 1],
                            cardMaxNum
                        }
                    }
                    return false
                }
                return false
            }
            return false
            
        case 3: // 三条（3）、三带一（4）、三带一对（5）、三顺子（6-15）、飞机带单（8-16）、飞机带对（12-15）
            if (arrLength === 3) {
                return { // 三条
                    cardType: 'SAN_TIAO',
                    cardTypeWeight: 1,
                    groupCardsWeight: arr[0],
                    cardMaxNum
                }
            } else if (arrLength === 4) {
                return { // 三带一
                    cardType: 'SAN_DAI_YI',
                    cardTypeWeight: 1,
                    groupCardsWeight: muchCardWeight,
                    cardMaxNum
                }
            } else if (arrLength === 5) {
                // 遍历牌权重信息字典，找出是否存在一个对子
                for (var card in dictionaryItems) {
                    if (dictionaryItems[card] === 2) {
                        return { // 三带一对
                            cardType: 'SAN_DAI_YI_DUI',
                            cardTypeWeight: 1,
                            groupCardsWeight: muchCardWeight,
                            cardMaxNum
                        } 
                    }
                }
                return false
            } else if (arrLength >= 6 && arrLength <= 16) {
                var sanArr = new Array()
                // 遍历牌权重信息字典，找出所有三条
                for (var card in dictionaryItems) {
                    if (dictionaryItems[card] === 3) {
                        sanArr.push(card*1)
                        // 排序
                        // this.sort(sanArr)
                        // sanArr = sanArr.sort( (a,b) => b - a )
                    }
                }
                // 至少两个三条，且不含三条不能大于A
                if (sanArr.length >= 2 && sanArr[sanArr.length - 1] <= 12) {
                    // 判断去重后是否构成顺子（至少2张顺子）
                    if (sanArr[sanArr.length - 1] - sanArr[0] + 1 === sanArr.length) {
                        if (sanArr.length * 3 === arrLength) {
                            return { // 三顺子
                                cardType: 'SAN_SHUN_ZI',
                                cardTypeWeight: 1,
                                groupCardsWeight: sanArr[sanArr.length - 1],
                                cardMaxNum
                            }
                        } else if (arrLength - sanArr.length * 3 === sanArr.length) {
                            return { // 飞机带单
                                cardType: 'FEI_JI_DAI_DAN',
                                cardTypeWeight: 1,
                                groupCardsWeight: sanArr[sanArr.length - 1],
                                cardMaxNum
                            }
                        } else if (arrLength - sanArr.length * 3 === sanArr.length * 2) {
                            // 遍历牌权重信息字典，若是飞机带双，则除了3对，其他都为对子
                            for (var card in dictionaryItems) {
                                if (dictionaryItems[card] !== 3 && dictionaryItems[card] !== 2) {
                                    return false
                                }
                            }
                            return { // 飞机带双
                                cardType: 'FEI_JI_DAI_SHUANG',
                                cardTypeWeight: 1,
                                groupCardsWeight: sanArr[sanArr.length - 1],
                                cardMaxNum
                            }
                        }
                        return false
                    }
                    return false
                }
                return false
            }
        case 4: // 炸弹（4）、四条带双单（6）、四条带双对（8）
            if (arrLength === 4) {
                return {
                    cardType: 'ZHA_DAN',
                    cardTypeWeight: 2,
                    groupCardsWeight: arr[0],
                    cardMaxNum
                }
            } else if (arrLength === 6) {
                return { // 四条带双单
                    cardType: 'SI_TIAO_DAI_SHUANG_DAN',
                    cardTypeWeight: 1,
                    groupCardsWeight: muchCardWeight,
                    cardMaxNum
                }
            } else if (arrLength === 8) {
                // 四条带双对 则只存在4条和对
                for (var card in dictionaryItems) {
                    if (dictionaryItems[card] !== 4 && dictionaryItems[card] !== 2) {
                        return false
                    }
                }
                return { // 四条带双对
                    cardType: 'SI_TIAO_DAI_SHAUNG_DUI',
                    cardTypeWeight: 1,
                    groupCardsWeight: muchCardWeight,
                    cardMaxNum
                }
            }
            return false
        default:
            return false
    }
}

function beat(prevArr, nextArr) {
    var prevArrType = getPokerType(prevArr)
    var nextArrType = getPokerType(nextArr)
    // 保证牌都是合法的
    if (prevArrType && nextArrType) {
        // 如果牌类型权重一致
        if (prevArrType.cardTypeWeight === nextArrType.cardTypeWeight) {
            // 如果牌组合类型、长度一致
            if (prevArr.length === nextArr.length && prevArrType.cardType === nextArrType.cardType ) {
                // 判断牌组合权重
                return prevArrType.groupCardsWeight < nextArrType.groupCardsWeight
            }
        } else if (prevArrType.cardTypeWeight < nextArrType.cardTypeWeight){ // 如果新牌类型权重更大
            return true
        }
    }
    return false
}


// 输入 [当前片面],[寻找范围] 输出 [牌面]

const cardsTypes = {
    DAN_TIAO ( groupCardsWeight, parentCards ){
        const combination = []
        const d = groupCardsWeight
        parentCards.map( v => {
            v > d? combination.push([v]):''
        })
        return combination
    }, 
    DUI_ZI ( groupCardsWeight, parentCards ) {
        if ( parentCards.length < 1 ) return []
        const d = groupCardsWeight
        return getPokerCount( parentCards, ( core, num ) => {
            core = core*1
            return num >= 2 && core > d ? [ core, core ] : null
        })
    }, 
    SAN_TIAO ( groupCardsWeight, parentCards ) {
        if ( parentCards.length < 2 ) return []
        const d = groupCardsWeight
        return getPokerCount( parentCards, ( core, num ) => {
            core = core*1
            return num >= 3 && core > d ? [ core, core, core ] : null
        })
    }, 
    SAN_DAI_YI ( groupCardsWeight, parentCards ) {
        if ( parentCards.length < 4 ) return []
        const san = []
        getPokerCount( parentCards, ( core, num ) => {
            core = core*1
            return num >= 3 && core > groupCardsWeight ? san.push([ core, core, core ]): [core]
        })
        const sandaiyi = []
        san.map( v => {
            const d = v[0]
            parentCards.map( v1 => {
                d != v1 ? sandaiyi.push([...v, v1]): ''
            })
        })
        return sandaiyi
    }, 
    SAN_DAI_YI_DUI ( groupCardsWeight, parentCards ) {
        if ( parentCards.length < 5 ) return []
        const san = [],dui = []
        getPokerCount( parentCards, ( core, num ) => {
            core = core*1
            if ( num === 3 && core > groupCardsWeight ) san.push([ core, core, core ])
            if ( num === 2 ) dui.push([ core, core ])
        })
        const sandaiyidui = []
        san.map( v => {
            const d = v[0]
            dui.map( v1 => {
                d != v1[0] ? sandaiyidui.push([...v, ...v1]): ''
            })
        })
        return sandaiyidui
    }, 
    SI_DAI_SHAUNG_DAN ( groupCardsWeight, parentCards ) {
        if ( parentCards.length < 6 ) return []
        const si = [],dan = []
        getPokerCount( parentCards, ( core, num ) => {
            core = core*1
            if ( num === 4 && core > groupCardsWeight ) si.push([ core, core, core, core ])
            dan.push(core)
        })
        const sandaiyidui = []
        si.map( v => {
            const d = v[0]
            parentCards.map( (v1,i) => {
                parentCards.map( (v2,i1) => {
                    d != v1 &&  d != v2 && i1 !== i? sandaiyidui.push([...v, v1, v2]): ''
                })
                
            })
        })
        return sandaiyidui
    },

    FEI_JI_DAI_DAN ( groupCardsWeight, parentCards, len ) {
        if ( parentCards.length < len * 4 ) return []

        const san = this.SAN_SHUN_ZI( groupCardsWeight, parentCards, len )
        if ( san.length === 0 ) return []
        const count = []
        const diff = {}
        getPokerCount( parentCards, ( core, num ) => {
            diff[core] = num
        })
        san.map( v => {
            const diff1 = Object.assign({}, diff)
            const d = [ ... new Set( v ) ]
            const con = []
            d.map( card => {
                const d1 = diff1[card] - 3
                if ( d1 <=0 ) delete diff1[card]
                else diff1[card] = diff1[card] - 3
            })
            for ( let k in diff1 ) {
                con.push([ ... v, k*1 ])
            }
            count.push(...con)
        })
        
        return count
    }, 
    SI_TIAO_DAI_SHUANG_DUI ( groupCardsWeight, parentCards ) {
        if ( parentCards.length < 8 ) return []
        const si = [],dan = []
        getPokerCount( parentCards, ( core, num ) => {
            if ( num === 4 && core > groupCardsWeight ) si.push([ core, core, core, core ])
            if ( num >= 2 ) dan.push(core)
        })
        const dlen = dan.length
        if ( dlen < 2 ) return []
        const cindex = C1( dlen )
        const coun = []
        cindex.map( v =>{
            const [a,b] = v
            const dana = dan[a]
            const danb = dan[b]
            si.map( v1 => {
                v1[0] !== dana && v1[0] !== danb ? coun.push([ ...v1, dana, dana, danb, danb ]) : ''
            })
        })
        return coun
    }, 
    FEI_JI_DAI_DUI ( groupCardsWeight, parentCards, len ) {
        if ( parentCards.length < len * 5 ) return []
        const san = this.SAN_SHUN_ZI( groupCardsWeight, parentCards, len )
        if ( san.length === 0 ) return []
        const count = []
        const diff = {}
        getPokerCount( parentCards, ( core, num ) => {
            num > 1 && num < 4 ? diff[core] = num : ''
        })
        san.map( v => {
            const diff1 = Object.assign({}, diff)
            const d = [ ... new Set( v ) ]
            const con = []
            d.map( card => {
                const d1 = diff1[card] - 3
                if ( d1 <= 1 ) delete diff1[card]
            })
            const key = Object.keys(diff1)
            const cindex = C1( key.length )
            cindex.map( vc => {
                const a = key[vc[0]]*1
                const b = key[vc[1]]*1
                count.push([ ...v, a, a, b, b ])
            })
        })
        return count
    }, 

    DAN_SHUN_ZI( groupCardsWeight, parentCards, len ) {
        if ( parentCards.length < len ) return []
        const shuns = []
        parentCards = [ ... new Set( parentCards.sort( (a,b) => b - a ) ) ]
        parentCards.map( (v,i1) => {
            const shun = []
            for ( let i = 0; i < len ; i ++) {
                12 >= v && v > groupCardsWeight && parentCards[i1+i] === v - i ? shun.push( v - i ) : ''
            }
            shun.length === len ? shuns.push(shun) : '' 
        })
        return shuns
    }, 
    SAN_SHUN_ZI( groupCardsWeight, parentCards, len ) {
        if ( parentCards.length < len*3 ) return []
        const shuns = [],san = []
        getPokerCount( parentCards, ( core, num ) => {
            12 > core && num >= 3 ? san.push(core*1):''
        })
        san1 = san.sort( (a,b) => b - a )
        san1.map( (v,i1) => {
            const shun = []
            for ( let i = 0; i < len ; i ++) {
                const d = v - i 
                v > groupCardsWeight && san[i1+i] === d ? shun.push( d,d,d ) : ''
            }
            shun.length === len*3 ? shuns.push(shun) : '' 
        })
        return shuns
    }, 
    SHUANG_SHUN_ZI( groupCardsWeight, parentCards, len ) {

        if ( parentCards.length < len*2 ) return []
        const shuns = [],san = []
        getPokerCount( parentCards, ( core, num ) => {
            12 > core && num >= 2 ? san.push(core*1):''
        })
        san1 = san.sort( (a,b) => b - a )
        san1.map( (v,i1) => {
            const shun = []
            for ( let i = 0; i < len ; i ++) {
                const d = v - i 
                v > groupCardsWeight && san[i1+i] === d ? shun.push( d,d ):''
            }
            shun.length === len*2 ? shuns.push(shun) : '' 
        })
        return shuns
    }, 
    ZHA_DAN( groupCardsWeight, parentCards) {
        if ( parentCards.length < 4 ) return []
        return getPokerCount( parentCards, ( core, num ) => {
            core =  core*1
            return core > groupCardsWeight && num === 4 ? [core, core, core, core]:null
        })
    }, 
    WANG_ZHA: null
}

const getLenght = {
    FEI_JI_DAI_DAN( cards ) {
        return cards.length / 4
    }, 
    FEI_JI_DAI_DUI( cards ) {
        return cards.length / 5
    }, 
    DAN_SHUN_ZI( cards ) {
        return cards.length
    }, 
    SAN_SHUN_ZI( cards ) {
        return cards.length / 3
    }, 
    SHUANG_SHUN_ZI( cards ) {
        return cards.length / 2
    }
}

// 在指定范围内找到 大于 当前牌面的 可能组合 cards 当前牌面
function eachPossibility( cards, parentCards ) {
    const {
        cardType,
        groupCardsWeight,
        cardTypeWeight
    } = getPokerType(cards)
    const len1 = getLenght[cardType] ? getLenght[cardType]( cards ) : null
    const df = cardsTypes[cardType]( groupCardsWeight, parentCards, len1 )
    if ( cardTypeWeight === 1 ) {
        return [...df, ...cardsTypes.ZHA_DAN( 0, parentCards)]
    } else return df
    
}

function eachPossibilityByPoints( cards, parentCards ) {
    cards = parsePoints( cards )
    parentCards = parsePoints( parentCards )
    const {
        cardType,
        groupCardsWeight
    } = getPokerType(cards)

    const len1 = getLenght[cardType] ? getLenght[cardType]( cards ) : null
    return getPoints( cardsTypes[cardType]( groupCardsWeight, parentCards, len1 ) )
}

// 计算 指定范围内 特定牌面出现的概率

// 记牌器 r [[农民1],[地主],[农民2]]
function createTotalCard (){
    const d = {}
    for ( let i = 0 ; i <= 0xf ; i ++) {
        d[ i ] = i <= 0xd ? 4 : 1
    }
    return d
}

function roundDoudizhu() {
    const round = {
        dipai: '',
        r: [],// 出牌记录
        user: { roles: -1, c : {} }
    }
    const total = createTotalCard()
    this.setDi = function (card) {
        round.dipai = card
    }

    // i [[农民1],[地主],[农民2]]
    this.add = function ( card, i ) {
        round.r.push([0,0,0])
        const pd = parsePoints( card )
        // pd.map( v => {
        //     total[v] = total[v] - 1
        // })
        round.r[round.r.length - 1][i] = pd
    }

    // 获取 已出 牌面
    this.getOutCard = nuUser => {
        const d = []
        const d1 = []
        round.r.map( v => {
            v.map( (v,i) => {
                // console.log( nuUser, i, v, nuUser !== undefined && i !== nuUser && v !== 0  )
                nuUser !== undefined && i !== nuUser && v !== 0 ? d1.push( ...v ) : ''
                v !== 0 ? d.push( ...v ) : ''
            })
        })
        const diff = ArrToCountObj( nuUser !== undefined ? d1 : d )
        return diff
    }

    // 获取剩余牌面
    this.getLast = function ( core = true ) {
        const d1 = {}
        const lObj = this.getOutCard( round.user.roles )
        const lObj1 = round.user.c
        // console.log( lObj1 )
        Object.keys(total).map( (v,i) => {
            if( i === 0 ) return
            const value = lObj[v] || 0
            const value1 = lObj1[v] || 0
            const d = total[v] - value - value1
            // console.log( v, getPoint(v), {value1,value}, total[v] )
            d > 0 ? d1[ core === false ? v : getPoint(v)] = d : ''
        })
        return d1
    }

    // 找到 剩余牌范围内的 大于 特定牌面的 组合
    this.getPossibility = function( cards ) {
        const d = []
        const p = eachPossibility( parsePoints (cards), prasePokerCountToArr( this.getLast(false) ) )
        p.map( v => {
            d.push(getPoints( v ))
        })
        return d
    }

    this.getRound = () => round

    this.setUser = function ( cards, i ) {
        cards = parsePoints( cards )
        round.user.c = ArrToCountObj( cards )
        round.user.roles = i
    }
}

function test() {
    // const d = new roundDoudizhu()
    // d.setUser(
    //     'K,K,Q,Q,Q,J,10,10,9,9,7,7,6,5,5,3,3',0
    // )
    // d.add('3',1)
    // d.add('5',2)
    // d.add('6',0)
    // d.add('Q',1)
    // d.add('2',2)
    // d.add('4,4',2)

    // console.log(
    //     d.getLast(),
    //     d.getPossibility("5,5")
    // )

    // const d = new roundDoudizhu()
    // d.setUser(
    //     'Sw,2,2,K,K,K,J,10,10,9,9,8,7,7,6,5,3',0
    // )
    // d.add('8,7,6,5,4',1)
    // d.add('9,8,7,6,5',0)
    // d.add('Q,J,10,9,8',1)
    // d.add('A,K,Q,J,10',1)
    // d.getPossibility("9,8,7,6,5")
    // console.log(d.getLast(),
    //     d.getPossibility("9,8,7,6,5")
    // )
    // const d = new roundDoudizhu()
    // d.setUser(
    //     '2AAKQQJJ1098887654',2
    // )
    // d.add('33',1)
    // d.add('66',0)
    // d.add('99',1)
    // d.add('55',1)
    // d.add('88',2)
    // d.add('JJ',1)
    // d.add("AA",2)
    // d.add("45678910JQK",2)

    const d = new roundDoudizhu()
    d.setUser(
        '2AKKQQQJJ99866553',0
    )
    d.add('4',1)
    d.add('6',2)
    d.add('8',0)
    d.add('10',1)
    d.add('2',2)
    d.add('S',1)

    d.add('345678910J',1)
    d.add('5',1)

    d.add('8',2)
    d.add('A',0)

    d.add('B',1)

    d.add('8910JQ',1)
    d.add('A',1)
}