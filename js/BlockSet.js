//TODO: ADD ALL THE COMBINATIONS
const blockSet = [
    [0, 0, 0, 0, 0], //_____ 0
    [1, 0, 0, 0, 0], //s____ 1
    [0, 1, 0, 0, 0], //_s___ 2
    [0, 0, 1, 0, 0], //__s__ 3
    [0, 0, 0, 1, 0], //___s_ 4
    [0, 0, 0, 0, 1], //____s 5
    [1, 1, 0, 0, 0], //ss___ 6
    [1, 1, 1, 0, 0], //sss__ 7
    [1, 1, 1, 1, 0], //ssss_ 8
    [1, 1, 1, 1, 1], //sssss 9
    [0, 0, 0, 1, 1], //___ss 10
    [0, 0, 1, 1, 1], //__sss 11
    [0, 1, 1, 1, 1], //_ssss 12
    [0, 0, 1, 1, 0], //__ss_ 13
    [0, 1, 1, 0, 0], //_ss__ 14
    [1, 0, 0, 0, 1], //s___s 15
    [0, 1, 0, 1, 0], //_s_s_ 16
    [0, 1, 1, 0, 1], //_ss_s 17
    [1, 1, 1, 0, 1], //sss_s 18
    [0, 1, 0, 1, 1], //_s_ss 19
    [0, 1, 1, 1, 0], //_sss_ 20
    [1, 0, 0, 1, 1], //s__ss 21
    [1, 0, 0, 1, 0], //s__s_ 22
    [1, 0, 1, 0, 0], //s_s__ 22
];