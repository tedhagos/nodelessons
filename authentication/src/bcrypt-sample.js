
const bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync('askted', salt);

console.log('ClearPass: askted | HashedPass: %s', hash );

console.log(bcrypt.compareSync('askted', hash));
console.log(bcrypt.compareSync('notbacon', hash));
