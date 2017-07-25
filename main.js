const TPLink = require("./tplink.js")
var uuidV4 = require('uuid/v4');

const TPLINK_USER = process.env.TPLINK_USER;
const TPLINK_PASS = process.env.TPLINK_PASS;
const TPLINK_TERM = process.env.TPLINK_TERM || uuidV4();

async function main(){

    const myTPLink = await TPLink.login(TPLINK_USER, TPLINK_PASS,TPLINK_TERM);

    console.log( myTPLink.getToken() )

    const dl = await myTPLink.getDeviceList();

    console.log( dl )
}

main();
