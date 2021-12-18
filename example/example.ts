import * as dotenv from "dotenv"
import { login } from '../lib/tplink'

dotenv.config({ path: __dirname + '/.env' })

const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// Consult the README for instructions on running this script.

async function main() {
  console.log('connecting to tplink using .ENV credentials')
  const tplink = await login(process.env.TEST_LOGIN_EMAIL, process.env.TEST_LOGIN_PASSWORD)
  console.log(tplink)

  console.log('getting device list')
  const deviceList = await tplink.getDeviceList()
  console.log(deviceList)

  console.log(`turning ${process.env.TEST_TPLINK_DEVICE} on`)
  const plug = await tplink.getHS100(process.env.TEST_TPLINK_DEVICE)
  await plug.powerOn()

  console.log(`waiting a few seconds`)
  await sleep(1000 * 3)

  console.log(`turning ${process.env.TEST_TPLINK_DEVICE} off`)
  await plug.powerOff()
}

main()