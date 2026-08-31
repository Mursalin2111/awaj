const mongoose = require('mongoose');
const User = require('./server/models/User');
async function test() {
  await mongoose.connect('mongodb://localhost:27017/awaj');
  try {
    const res = await User.findOneAndUpdate(
      { email: 'newaccount@gmail.com' },
      { verificationCode: '123456', codeExpiry: new Date() },
      { upsert: true, new: true }
    );
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit(0);
}
test();
