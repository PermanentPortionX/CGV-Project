//TODO: ADD ALL THE COMBINATIONS
//This class contains all the combinations of obstacles and power ups
//Obstacles symbols
// 1 -> Spikes (s)
// 2 -> Cube (c)
// 3 -> floatingBlocks (f)
const obstaclekSet = [
    /**************************SPIKES********************************/

    //One spike - Super easy Easy level difficulty
    [0, 0, 0, 0, 0], //_____ 0
    [1, 0, 0, 0, 0], //s____ 1
    [0, 1, 0, 0, 0], //_s___ 2
    [0, 0, 1, 0, 0], //__s__ 3
    [0, 0, 0, 1, 0], //___s_ 4
    [0, 0, 0, 0, 1], //____s 5
    //Two spikes consecutive spikes - Very very very Easy level
    [1, 1, 0, 0, 0], //ss___ 6
    [0, 1, 1, 0, 0], //_ss__ 7
    [0, 0, 1, 1, 0], //__ss_ 8
    [0, 0, 0, 1, 1], //___ss 9
    //Two spikes with a one gap - a bit Easy level
    [1, 0, 1, 0, 0], //s_s__ 10
    [0, 1, 0, 1, 0], //_s_s_ 11
    [0, 0, 1, 0, 1], //__s_s 12
    //Two spikes with two gaps - Very easy level
    [1, 0, 0, 1, 0], //s__s_ 13
    [0, 1, 0, 0, 1], //_s__s 14
    //Two spikes, with three gaps - super easy
    [1, 0, 0, 0, 1], //s___s 15
    //Three consecutive spikes -  Very Easy level
    [1, 1, 1, 0, 0], //sss__ 16
    [0, 1, 1, 1, 0], //_sss_ 17
    [0, 0, 1, 1, 1], //__sss 18
    //Three spikes, first two consecutive, has one gap - Easy
    [1, 1, 0, 1, 0], //ss_s_ 19
    [0, 1, 1, 0, 1], //_ss_s 20
    //Three spikes, first two consecutive, two gaps - very easy
    [1, 1, 0, 0, 1], //ss__s 21
    [1, 0, 0, 1, 1], //s__ss 22
    //Three spikes, last two consecutive - very easy
    [0, 1, 0, 1, 1], //_s_ss 23
    [1, 0, 1, 1, 0], //s_ss_ 24
    //Four consecutive spikes - challenging
    [1, 1, 1, 1, 0], //ssss_ 25
    [0, 1, 1, 1, 1], //_ssss 26
    //Four spikes, first & last three consecutive - challenging
    [1, 1, 1, 0, 1], //sss_s 27
    [1, 0, 1, 1, 1], //s_sss 28
    //four spikes,  first two and last two consecutive
    [1, 1, 0, 1, 1], //ss_ss 29
    //five spikes - challenging
    [1, 1, 1, 1, 1], //sssss 30

    /***********************************BLOCKS*************************************/
    [2, 0, 0, 0, 0], //b____ 31
    [0, 2, 0, 0, 0], //_b___ 32
    [0, 0, 2, 0, 0], //__b__ 33
    [0, 0, 0, 2, 0], //___b_ 34
    [0, 0, 0, 0, 2], //____b 35
    //Two blocks consecutive - Very very very Easy level
    [2, 2, 0, 0, 0], //bb___ 36
    [0, 2, 2, 0, 0], //_bb__ 37
    [0, 0, 2, 2, 0], //__bb_ 38
    [0, 0, 0, 2, 2], //___bb 39
    //Two blocks with a one gap - a bit Easy level
    [2, 0, 2, 0, 0], //b_b__ 40
    [0, 2, 0, 2, 0], //_b_b_ 41
    [0, 0, 2, 0, 2], //__b_b 42
    //Two blocks with two gaps - Very easy level
    [2, 0, 0, 2, 0], //b__b_ 43
    [0, 2, 0, 0, 2], //_b__b 44
    //Two blocks, with three gaps - super easy
    [2, 0, 0, 0, 2], //b___b 45
    //Three consecutive blocks -  Very Easy level
    [2, 2, 2, 0, 0], //bbb__ 46
    [0, 2, 2, 2, 0], //_bbb_ 47
    [0, 0, 2, 2, 2], //__bbb 48
    //Three blocks, first two consecutive, has one gap - Easy
    [2, 2, 0, 2, 0], //bb_b_ 49
    [0, 2, 2, 0, 2], //_bb_b 50
    //Three blocks, first two consecutive, two gaps - very easy
    [2, 2, 0, 0, 2], //bb__b 51
    [2, 0, 0, 2, 2], //b__bb 52
    //Three blocks, last two consecutive - very easy
    [0, 2, 0, 2, 2], //_b_bb 53
    [2, 0, 2, 2, 0], //b_bb_ 54
    //Four consecutive blocks - challenging
    [2, 2, 2, 2, 0], // bbbb_ 55
    [0, 2, 2, 2, 2], // _bbbb 56
    //Four blocks, first & last three consecutive - challenging
    [2, 2, 2, 0, 2], //bbb_b 57
    [2, 0, 2, 2, 2], //b_bbb 58
    //four blocks,  first two and last two consecutive
    [2, 2, 0, 2, 2], //bb_bb 59
    //five blocks - challenging
    [2, 2, 2, 2, 2], //bbbbb 60

    /*****************************FLOATING CUBES**************************************/

    [3, 0, 0, 0, 0], //f____ 61
    [0, 3, 0, 0, 0], //_f___ 62
    [0, 0, 3, 0, 0], //__f__ 63
    [0, 0, 0, 3, 0], //___f_ 64
    [0, 0, 0, 0, 3], //____f 65
    //Two consecutive floating cubes - Very very very Easy level
    [3, 3, 0, 0, 0], //ff___ 66
    [0, 3, 3, 0, 0], //_ff__ 67
    [0, 0, 3, 3, 0], //__ff_ 68
    [0, 0, 0, 3, 3], //___ff 69
    //Two floating cubes with a one gap - a bit Easy level
    [3, 0, 3, 0, 0], //f_f__ 70
    [0, 3, 0, 3, 0], //_f_f_ 71
    [0, 0, 3, 0, 3], //__f_f 72
    //Two floating cubes with two gaps - Very easy level
    [3, 0, 0, 3, 0], //f__f_ 73
    [0, 3, 0, 0, 3], //_f__f 74
    //Two spikes, with three gaps - super easy
    [3, 0, 0, 0, 3], //f___f 75
    //Three consecutive floating cubes -  Very Easy level
    [3, 3, 3, 0, 0], //fff__ 76
    [0, 3, 3, 3, 0], //_fff_ 77
    [0, 0, 3, 3, 3], //__fff 78
    //Three floating cubes, first two consecutive, has one gap - Easy
    [3, 3, 0, 3, 0], //ff_f_ 79
    [0, 3, 3, 0, 3], //_ff_f 80
    //Three floating cubes, first two consecutive, two gaps - very easy
    [3, 3, 0, 0, 3], //ff__f 81
    [3, 0, 0, 3, 3], //f__ff 82
    //Three floating cubes, last two consecutive - very easy
    [0, 3, 0, 3, 3], //_f_ff 83
    [3, 0, 3, 3, 0], //f_ff_ 84
    //Four consecutive floating cubes - challenging
    [3, 3, 3, 3, 0], //ffff_ 85
    [0, 3, 3, 3, 3], //_ffff 86
    //Four floating cubes, first & last three consecutive - challenging
    [3, 3, 3, 0, 3], //fff_f 87
    [3, 0, 3, 3, 3], //f_fff 88
    //four spikes,  first two and last two consecutive
    [3, 3, 0, 3, 3], //ff_ff 89
    //five floating cubes - challenging
    [3, 3, 3, 3, 3], //fffff 90

    /****************************SPIKES AND BLOCKS**************************************/
    //SPIKE and block consecutively - Easy
    [1, 2, 0, 0, 0], //sb___ 91
    [0, 1, 2, 0, 0], //_sb__ 92
    [0, 0, 1, 2, 0], //__sb_ 93
    [0, 0, 0, 1, 2], //___sb 94
    //block and spike consecutively - Easy level
    [2, 1, 0, 0, 0], //bs___ 95
    [0, 2, 1, 0, 0], //_bs__ 96
    [0, 0, 2, 1, 0], //__bs_ 97
    [0, 0, 0, 2, 1], //___bs 98

    //spike and block with a one gap - a bit Easy level
    [1, 0, 2, 0, 0], //s_b__ 99
    [0, 1, 0, 2, 0], //_s_b_ 100
    [0, 0, 1, 0, 2], //__s_b 101
    //block and spike with a one gap - a bit Easy level
    [2, 0, 1, 0, 0], //b_s__ 102
    [0, 2, 0, 1, 0], //_b_s_ 103
    [0, 0, 2, 0, 1], //__b_s 104

    //spike and block with two gaps - Very easy level
    [1, 0, 0, 2, 0], //s__b_ 105
    [0, 1, 0, 0, 2], //_s__b 106
    //block and spike with two gaps - Very easy level
    [2, 0, 0, 1, 0], //b__s_ 107
    [0, 2, 0, 0, 1], //_b__s 108

    //spike and block with three gaps - super easy
    [1, 0, 0, 0, 2], //s___b 109
    //block and spike, with three gaps - super easy
    [2, 0, 0, 0, 1], //b___s 110

    //two blocks and spike - Easy level
    //*two consecutive blocks and a spike
    [2, 2, 1, 0, 0], //bbs__ 111
    [0, 2, 2, 1, 0], //_bbs_ 112
    [0, 0, 2, 2, 1], //__bbs 113
    [0, 0, 1, 2, 2], //__sbb 114
    [0, 1, 2, 2, 0], //_sbb_ 115
    [1, 2, 2, 0, 0],//sbb__ 116
    //*two consecutive blocks and a space before next spike
    [2, 2, 0, 1, 0], // bb_s_ 117
    [0, 2, 2, 0, 1], //_bb_s 118
    [0, 1, 0, 2, 2], // _s_bb 119
    [1, 0, 2, 2, 0], //s_bb_ 120
    //* two consecutive blocks and two spaces before next spike
    [2, 2, 0, 0, 1], //bb__s 121
    [1, 0, 0, 2, 2], //s__bb 122
    // two spike and block - Easy level
    //* (exchange the order of the above)

    //two block and two spike - challenging level
    [2, 2, 1, 1, 0], //bbss_ 123
    [0, 2, 2, 1, 1], //_bbss 124
    [2, 2, 0, 1, 1], //bb_ss 125
    //two spike and two block - challenging level
    [1, 1, 2, 2, 0], //ssbb_ 126
    [0, 1, 1, 2, 2], //_ssbb 127
    [1, 1, 0, 2, 2], //ss_bb 128
    //three spike and block - a bit of challenge level
    [1, 1, 1, 2, 0], //sssb_ 129
    [0, 1, 1, 1, 2], //_sssb 130
    [1, 1, 1, 0, 2], //sss_b 131
    //three block and spike - a bit of challenge level
    //* (exchange the order of the above)

    //four spike and block -  challenging level
    [1, 1, 1, 1, 2], //ssssb 132
    [2, 1, 1, 1, 1], //bssss 133

    /***************************SPIKES AND FLOATING CUBES********************************/
//SPIKE and FLOATING CUBE consecutively - Easy
    [1, 3, 0, 0, 0], //sf___ 134
    [0, 1, 3, 0, 0], //_sf__ 135
    [0, 0, 1, 3, 0], //__sf_ 136
    [0, 0, 0, 1, 3], //___sf 137
    //FLOATING CUBE and spike consecutively - Easy level
    [3, 1, 0, 0, 0], //fs___ 138
    [0, 3, 1, 0, 0], //_fs__ 139
    [0, 0, 3, 1, 0], //__fs_ 140
    [0, 0, 0, 3, 1], //___fs 141

    //spike and FLOATING CUBE with a one gap - a bit Easy level
    [1, 0, 3, 0, 0], //s_f__ 142
    [0, 1, 0, 3, 0], //_s_f_ 143
    [0, 0, 1, 0, 3], //__s_f 144
    //FLOATING CUBE and spike with two gaps - Very easy level
    [3, 0, 0, 1, 0], //f__s_ 145
    [0, 3, 0, 0, 1], //_f__s 146

    //spike and FLOATING CUBE with three gaps - super easy
    [1, 0, 0, 0, 3], //s___f 147
    //FLOATING CUBE and spike, with three gaps - super easy
    [3, 0, 0, 0, 1], //f___s 148

    //two FLOATING CUBE and two spike - challenging level
    [3, 3, 1, 1, 0], //ffss_ 149
    [0, 3, 3, 1, 1], //_ffss 150
    [3, 3, 0, 1, 1], //ff_ss 151
    //two spike and two FLOATING CUBE -
    [1, 1, 3, 3, 0], //ssff_ 152
    [0, 1, 1, 3, 3], //_ssff 153
    [1, 1, 0, 3, 3], //ss_ff 154
    //three spike and floating cube - a bit of challenge level
    [1, 1, 1, 3, 0], //sssf_ 155
    [0, 1, 1, 1, 3], //_sssf 156
    [1, 1, 1, 0, 3], //sss_f 157

    //three floating cube and spike - a bit of challenge level
    //* (exchange the order of the above)

    //four spike and floating cube -  challenging level
    [1, 1, 1, 1, 3], //ssssf 158
    [3, 1, 1, 1, 1], //fssss 159

    //interesting combinations
    [3, 1, 3, 1, 1], //fsfss 160
    [1, 1, 3, 1, 1], //ssfss 161

    /***************************FLOATING CUBES and BLOCKS********************************/
//block and FLOATING CUBE consecutively - Easy
    [2, 3, 0, 0, 0], //bf___ 162
    [0, 2, 3, 0, 0], //_bf__ 163
    [0, 0, 2, 3, 0], //__bf_ 164
    [0, 0, 0, 2, 3], //___bf 165
    //block and FLOATING CUBE with a one gap - a bit Easy level
    [2, 0, 3, 0, 0], //b_f__ 166
    [0, 2, 0, 3, 0], //_b_f_ 167
    [0, 0, 2, 0, 3], //__b_f 168
    //FLOATING CUBE and block with two gaps - Very easy level
    [3, 0, 0, 2, 0], //f__b_ 169
    [0, 3, 0, 0, 2], //_f__b 170

    //block and FLOATING CUBE with three gaps - super easy
    [2, 0, 0, 0, 3], //b___f 171
    //FLOATING CUBE and block, with three gaps - super easy
    [3, 0, 0, 0, 2], //f___b 172

    //two FLOATING CUBE and two block - challenging level
    [3, 3, 2, 2, 0], //ffbb_ 173
    [0, 3, 3, 2, 2], //_ffbb 174
    [3, 3, 0, 2, 2], //ff_bb 175
    //two block and two FLOATING CUBE -
    [2, 2, 3, 3, 0], //bbff_ 176
    [0, 2, 2, 3, 3], //_bbff 177
    [2, 2, 0, 3, 3], //bb_ff 178
    //three block and floating cube - a bit of challenge level
    [2, 2, 2, 3, 0], //bbbf_ 179
    [0, 2, 2, 2, 3], //_bbbf 180
    [2, 2, 2, 0, 3], //bbb_f 182

    //three block and floating cube - a bit of challenge level
    //* (exchange the order of the above)

    //four spike and block -  challenging level
    [2, 2, 2, 2, 3], //bbbbf 182
    [3, 2, 2, 2, 2], //fbbbb 183

    //interesting combinations
    [3, 2, 3, 2, 2], //fbfbb 184
    [2, 2, 3, 2, 2], //bbfbb 185

    /********************************Spike, block and Floating cubes*******************************************/

    //spike, block and cube
    [1, 2, 3, 0, 0], //sbf__ 186
    [0, 1, 2, 3, 0], //_sbf_ 187
    [1, 1, 3, 2, 2], //ssfbb 188
    [2, 1, 1, 2, 3], //bssbf 189
    [3, 1, 3, 3, 2], //fsffb 190

    //add more combinations





];