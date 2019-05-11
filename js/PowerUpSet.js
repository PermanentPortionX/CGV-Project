//-1 -> no power up
//90 -> heart
//93 -> shield
//94 -> trap
//95 -> floating_heart
//98 -> floating_shield
//99 -> floating_trap
const powerUpSet = [
    [90, -1, -1, -1, -1], //h____ 0
    [-1, 90, -1, -1, -1], //_h___ 1
    [-1, -1, 90, -1, -1], //__h__ 2
    [94, -1, -1, -1, -1], //t____ 3
    [-1, -1, 95, -1, -1], //h____ 4 floating
    [-1, -1, 99, -1, -1], //t____ 5 floating
    [-1, -1, 93, -1, -1], //__s__ 6 shield
    [-1, -1, 98, -1, -1], //__s__ 7 floating
];