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
