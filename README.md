Install with npm:

  npm install --save tplink-cloud-api

Usage 

    const tplink = require('tplink-cloud-api')
	async function main() { 
      let myTPlink = await tplink.login('username@example.com', 'Password','TOKEN')
		  //Token is generated if not specified
	    let deviceList = await myTPlink.getDeviceList()
	    //Generating device list is required
	    let myDevice = me.getLB100("Device Alias");
	    myDevice.transition_light_state(1,100)
	}
	main()

Requires Node.js > v7.7 (async)
