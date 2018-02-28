var Mam = require('./mam.node.js')
var readlineSync = require('readline-sync');
const chalk = require('chalk')

var IOTA = require('iota.lib.js')
var iota = new IOTA({ provider: `https://nodes.testnet.iota.org:443/` })


var root = readlineSync.question('Please input root of msg tree: ')
//var key = readlineSync.question('Please input your key.')


// Initialise MAM State
var mamState = Mam.init(iota)

// Callback used to pass data out of the fetch
const logData = data => console.log(JSON.parse(iota.utils.fromTrytes(data)))

const execute = async () => {
    // Callback used to pass data + returns next_root
    var resp = await Mam.fetch(root, 'public', null, logData)
    console.log(chalk.yellow(JSON.stringify(resp)))
    root = resp.nextRoot
    console.log(chalk.blue("list done, wait for next loop..."))

}

//start
console.log(chalk.blue("Start listening tree root: " + root + "..." ))
setInterval(execute, 5000)