import pkg from 'transbank-sdk';
const { WebpayPlus, Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = pkg;

// Declare a variable to hold the transaction instance
let tx;

// Use a global object to store the instance in a non-production environment
if (process.env.NODE_ENV === "production") {
  tx = new WebpayPlus.Transaction(
    new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration // This should change to Environment.Production for actual production
    )
  );
} else {
  if (!global.__tx__) {
    global.__tx__ = new WebpayPlus.Transaction(
      new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
      )
    );
  }
  tx = global.__tx__;
}

export { tx };
