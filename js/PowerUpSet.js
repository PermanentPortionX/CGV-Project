//-1 -> no power up
//90 -> heart
//91 -> bomb
//92 -> gun
//93 -> invincibility
//94 -> trap
//95 -> floating_heart
//96 -> floating_bomb
//97 -> floating_gun
//98 -> floating_invincible
//99 -> floating_trap
const powerUpSet = [
    [90, -1, -1, -1, -1], //h____ 0
    [-1, 90, -1, -1, -1], //_h___ 1
    [-1, -1, 90, -1, -1], //__h__ 2
    [91, -1, -1, -1, -1], //b____ 3
    [92, -1, -1, -1, -1], //g____ 4
    [94, -1, -1, -1, -1], //t____ 5
    [-1, -1, 95, -1, -1], //h____ 6 floating
    [-1, -1, 96, -1, -1], //b____ 7 floating
    [-1, -1, 97, -1, -1], //g____ 8 floating
    [-1, -1, 99, -1, -1], //t____ 9 floating
    [93, -1, -1, -1, -1], //i____ 10 invincible
];