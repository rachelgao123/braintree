const express = require('express');
const router = express.Router();
const braintree = require('braintree');

router.post('/', (req, res, next) => {
  const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: '487x583rmn8wr74z',
    publicKey: 'fwd6r8qrpzwg9n7b',
    privateKey: 'b980446105e682ad127c9f08107bd89e'
  });

  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;

  //Verify credit card
  gateway.paymentMethod.create({
    customerId: "1234",
    paymentMethodNonce: nonceFromTheClient,
    options: {
      verifyCard: true,
      verificationMerchantAccountId: "rwg",
      verificationAmount: "2.00"
    }
  }, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      res.status(500).send(error);
    }
  });


  // Create a new transaction for $10
  const newTransaction = gateway.transaction.sale({
    amount: '300.00',
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, (error, result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

module.exports = router;