var readlineSync = require('readline-sync');
const chalk = require('chalk')

var IOTA = require('iota.lib.js')
var Mam = require('./mam.client.js/lib/mam.node.js')

//more public node can be found at https://www.tangle-nodes.com/index.php?sorts[load]=1
var iota = new IOTA({ provider: 'https://nodes.iota.fm' })


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