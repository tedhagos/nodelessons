

const bcrypt = require('bcrypt');

var encrypt = function encrypt(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return hash;
}

var decrypt = function decrypt(clearPassword, hashedPassword){
  return bcrypt.compareSync(clearPassword, hashedPassword);
}


module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
