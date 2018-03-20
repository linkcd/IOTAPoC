# Introduction 
This is a PoC project to explore the possibilities of MAM in IOTA.
Read more about IOTA: iota.org
Read more about MAM: [Introducing Masked Authenticated Messaging](https://blog.iota.org/introducing-masked-authenticated-messaging-e55c1822d50e)

Deep dive:
- [In depth explanation of how IOTA making a transaction](https://medium.com/biilabs/in-depth-explanation-of-how-iota-making-a-transaction-bcdd9713b939)
- [IOTA: MAM Eloquently Explained](https://medium.com/@abmushi/iota-mam-eloquently-explained-d7505863b413)

This PoC is mainly based on repo: https://github.com/l3wi/mam.client.js 

# Getting Started
Install
```bash
npm i
```

Put something to tangle
```bash
node tangleWriter.js
```

Read the data from tangle, based on an address
```bash
node tangleReader.js
```

Alternatively, you can also use https://iota-mam-explorer.now.sh/ to read data 


# Note
For speeding up the write and read, the code is using the same node (nodes.iota.fm) as https://iota-mam-explorer.now.sh/ 

