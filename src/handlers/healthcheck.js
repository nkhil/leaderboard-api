'use strict'

function ping(_, res) {
  res.status(200).json({ status: 'OK' });
}

module.exports = {
  ping,
}
