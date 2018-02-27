
var fetch = require('node-fetch')
var crypto = require('crypto')
var Mam = require('./mam.node.js')
var IOTA = require('iota.lib.js')
const powboxPatch = require('@iota/powbox.patch')

var iota = new IOTA({ provider: `https://nodes.testnet.iota.org:443/` })
powboxPatch(iota, 'https://powbox.testnet.iota.org')

// Set Varibles
var debug = false // Set to 'false' to publish data live
let uuid = 'VeracityTest' // Your device ID is here.
let secretKey = 'OWOIFYHNCBSFQIM' // Your device's secret key here

// API end point
let endpoint = 'https://api.marketplace.tangle.works/newData'

// Random Key Generator
const keyGen = length => {
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'
    var values = crypto.randomBytes(length)
    var result = new Array(length)
    for (var i = 0; i < length; i++) {
    result[i] = charset[values[i] % charset.length]
    }
    return result.join('')
}

// Initialise MAM State
let mamState = Mam.init(iota, keyGen(81))
let mamKey = keyGen(81) // Set initial key

// Publish to tangle
const publish = async packet => {
    // Set channel mode & update key
    mamState = Mam.changeMode(mamState, 'restricted', mamKey)
    // Create Trytes
    var trytes = iota.utils.toTrytes(JSON.stringify(packet))
    // Get MAM payload
    var message = Mam.create(mamState, trytes)
    // Save new mamState
    mamState = message.state
    // Attach the payload.
    await Mam.attach(message.payload, message.address)
    console.log('Attached Message')

    if (!debug) {
        // Push the MAM root to the demo DB
        let pushToDemo = await pushKeys(message.root, mamKey)
        console.log("pusing root to db, root: " + message.root)
        console.log(pushToDemo)
        // Change MAM key on each loop
        mamKey = keyGen(81)
    }
}

// Push keys to market place.
const pushKeys = async (root, sidekey) => {
    const packet = {
    sidekey: sidekey,
    root: root,
    time: Date.now()
    }
    // Initiate Fetch Call
    var resp = await fetch(endpoint, {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: uuid, packet, sk: secretKey })
    })
    return resp.json()
}

// Emulate data being ingested
Array(4)
    .fill()
    .map((_, i) =>
    publish({
        time: Date.now(),
        // Change below to read actual values!
        data: {
            temp: (Math.random() * 50).toFixed(2)

        }
    })
    )
