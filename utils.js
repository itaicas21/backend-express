function validId(id) {
  const idArray = id.split("-");
  console.log(idArray);
  for (let index = 0; index < idArray.length; index++) {
    const idPart = idArray[index];
    console.log(idPart.length);
    if (idPart.length !== 8 && idPart.length !== 4 && idPart.length !== 12) {
      return false;
    }
  }
  return true;
}
function deleteTestDirectory() {
  const fs = require("fs");
  const path = require("path");
  const directory = "tests";

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

module.exports = { validId, deleteTestDirectory };
