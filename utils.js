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
module.exports = { validId };
