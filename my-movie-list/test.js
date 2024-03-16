const x = [1, 2, 3, 4, 5]

const value = x.findIndex(ele => ele === 4)

console.log(value)

function test(data) {

    let ans = 0

    data.forEach((ele) => {
        if (ele === 4) return //若 if 條件成立，則直接跳出函式
        ans += ele
    })
    return ans
}

result = test(x)

console.log(result)