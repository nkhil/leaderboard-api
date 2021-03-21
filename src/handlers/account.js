function getAccount(req, res) {
  res.status(200).render('account.html');
}

module.exports = {
  getAccount,
};
