# tplink-cloud-api example

This example app shows how to use the tplink-cloud-api library.  

First, create a .env file in this example folder with the following fields from your tplink cloud account.

TEST_LOGIN_EMAIL=your_tplink_account
TEST_LOGIN_PASSWORD=your_tplink_account_password
TEST_TPLINK_DEVICE=name_of_switch_to_toggle

Then run the start script, which will connect to tp-link, get and print a list of devices, turn on the device listed above, wait a few seconds, and then turn that device off.

The script assumes a smart plug, but other devices like smart bulbs should also work.  For TEST_TPLINK_DEVICE you should use a 'alias' field from one of the device entries queried with getDeviceList().
