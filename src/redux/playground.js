const example = {
    "id": "285",
    "name": "Connections #285",
    "createdAt": "2024-03-22T00:00:00.000Z",
    "board": {
        "JUMPING ANIMALS": {
            "level": 0,
            "members": [
                "CRICKET",
                "FROG",
                "HARE",
                "KANGAROO"
            ]
        },
        "APPLY PRESSURE TO": {
            "level": 1,
            "members": [
                "CRUSH",
                "MASH",
                "PRESS",
                "SQUASH"
            ]
        },
        "OLYMPIC SPORTS": {
            "level": 2,
            "members": [
                "BREAKING",
                "HOCKEY",
                "SKELETON",
                "TRAMPOLINE"
            ]
        },
        "THINGS YOU CAN SET": {
            "level": 3,
            "members": [
                "MOOD",
                "RECORD",
                "TABLE",
                "VOLLEYBALL"
            ]
        }
    },
    "startingBoard": [
        [
            "VOLLEYBALL",
            "SQUASH",
            "TABLE",
            "HOCKEY"
        ],
        [
            "RECORD",
            "BREAKING",
            "CRICKET",
            "PRESS"
        ],
        [
            "FROG",
            "SKELETON",
            "MOOD",
            "CRUSH"
        ],
        [
            "TRAMPOLINE",
            "KANGAROO",
            "MASH",
            "HARE"
        ]
    ]
}

const myBoard = {

}

const userGivenCatergory = "category"
const userGivenLevel = 0

const index = -1
if (Object.keys(myBoard).map(key => {
    if (key === "level") {
        if (myBoard[key].level === userGivenLevel) {
            console.log("found")
            // index =
            return true
        }
    }}))
{
    myBoard[userGivenCatergory] = {
        level: 1,
        members: [
            "",
            "",
            "",
            ""
        ]
    }
}
else {
    myBoard[userGivenCatergory].level = -1
}

// myBoard["new cat"] = myBoard["category"]
//
// delete myBoard["category"]

console.log(myBoard)

// Object.keys(myBoard).map(category => {
//     console.log("cat: ", category)
//     if (myBoard[category].level === 0) {
//         console.log("okkkk")
//     }
// })
// console.log(myBoard)