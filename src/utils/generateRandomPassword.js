function generateRandomPassword() {
  let randomNumber = Math.floor(Math.random() * 1000000);
  let randomPassword = String(randomNumber).padStart(6, "0");
  return randomPassword;
}

module.exports = generateRandomPassword;
