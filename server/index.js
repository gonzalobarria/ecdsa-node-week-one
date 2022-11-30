const express = require('express');
const { getAddress, recoverKey } = require('./components/utils');
const { balances } = require('./components/constants');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', async (req, res) => {
  const { sign, recoveryBit, recipient, msg } = req.body;

  const ss = JSON.parse(sign);
  const signature = new Uint8Array(ss.sign);

  try {
    const publickKey = await recoverKey(
      JSON.stringify(msg),
      signature,
      recoveryBit
    );
    const { amount } = msg;

    const sender = getAddress(publickKey);

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: 'Not enough funds!' });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
