import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors middleware
import dotenv from 'dotenv'; // Import dotenv to load environment variables
import {
  createAuthenticatedClient,
  OpenPaymentsClientError,
  isFinalizedGrant,
} from '@interledger/open-payments';
import fs from 'fs';

const app = express();
const port = 8000;

// Use CORS to allow requests from your frontend origin
app.use(cors({ origin: 'http://localhost:3000' })); // Replace with your frontend URL

app.use(bodyParser.json());

// Global variable to store grant data (for simplicity)
let grantData = {};

/**
 * Endpoint to create a payment
 * Expects JSON body with:
 * - sendingWalletAddress: string
 * - amount: string (amount in decimal format, e.g., "10.00")
 * - projectID: string (used as description for the payment)
 */
app.post('/create-payment', async (req, res) => {
  try {
    const { sendingWalletAddress, amount, projectID } = req.body;
    console.log('sendingWalletAddress:', sendingWalletAddress);
    console.log('amount:', amount);
    console.log('projectID (description):', projectID);  // Log projectID as description

    if (!sendingWalletAddress || !amount) {
      return res.status(400).json({ error: 'Missing sendingWalletAddress or amount' });
    }

    // Convert amount to the smallest unit based on assetScale (e.g., cents)
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    

    dotenv.config(); // Load environment variables from .env file

    // Replace with your actual values
    const RECEIVING_WALLET_ADDRESS = process.env.RECEIVING_WALLET_ADDRESS;
    console.log('RECEIVING_WALLET_ADDRESS:', RECEIVING_WALLET_ADDRESS);
    const PRIVATE_KEY_PATH = "./private.key";
    // from .env file 
    const KEY_ID = dotenv.config().parsed.KEY_ID;

    // Read the private key
    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

    // Create the authenticated client
    const client = await createAuthenticatedClient({
      walletAddressUrl: RECEIVING_WALLET_ADDRESS,
      privateKey: privateKey,
      keyId: KEY_ID,
    });

    // Get wallet addresses
    const receivingWalletAddress = await client.walletAddress.get({
      url: RECEIVING_WALLET_ADDRESS,
    });

    const sendingWallet = await client.walletAddress.get({
      url: sendingWalletAddress,
    });

    console.log('Got wallet addresses.', {
      receivingWalletAddress,
      sendingWalletAddress: sendingWallet,
    });

    // Step 1: Get a grant for the incoming payment (on the receiving wallet)
    const incomingPaymentGrant = await client.grant.request(
      {
        url: receivingWalletAddress.authServer,
      },
      {
        client: receivingWalletAddress.id,
        access_token: {
          access: [
            {
              type: 'incoming-payment',
              actions: ['read', 'complete', 'create'],
            },
          ],
        },
      }
    );

    console.log('\nStep 1: Got incoming payment grant', incomingPaymentGrant);

    // Step 2: Create the incoming payment
    const incomingPayment = await client.incomingPayment.create(
      {
        url: receivingWalletAddress.resourceServer,
        accessToken: incomingPaymentGrant.access_token.value,
      },
      {
        walletAddress: receivingWalletAddress.id,
        incomingAmount: {
          assetCode: receivingWalletAddress.assetCode,
          assetScale: receivingWalletAddress.assetScale,
          value: (amountValue * Math.pow(10, receivingWalletAddress.assetScale)).toString(),
        },
      }
    );

    console.log('\nStep 2: Created incoming payment', incomingPayment);

    // Step 3: Get a quote grant (on the sending wallet)
    const quoteGrant = await client.grant.request(
      {
        url: sendingWallet.authServer,
      },
      {
        client: sendingWalletAddress,
        access_token: {
          access: [
            {
              type: 'quote',
              actions: ['create', 'read'],
            },
          ],
        },
      }
    );

    console.log('\nStep 3: Got quote grant', quoteGrant);

    // Step 4: Create a quote
    const quote = await client.quote.create(
      {
        url: sendingWallet.resourceServer,
        accessToken: quoteGrant.access_token.value,
      },
      {
        walletAddress: sendingWalletAddress,
        receiver: incomingPayment.id,
        method: 'ilp',
      }
    );

    console.log('\nStep 4: Got quote', quote);

    // Step 5: Start the grant process for the outgoing payments
    const outgoingPaymentGrant = await client.grant.request(
      {
        url: sendingWallet.authServer,
      },
      {
        client: sendingWalletAddress,
        access_token: {

          access: [
            {
              type: 'outgoing-payment',
              actions: ['read', 'create'],
              limits: {
                debitAmount: {
                  assetCode: quote.debitAmount.assetCode,
                  assetScale: quote.debitAmount.assetScale,
                  value: quote.debitAmount.value,
                },
                metadata: {
                  "description": projectID.toString(),
                }
              },
              identifier: sendingWalletAddress,

            },
          ],
        },
        interact: {
          start: ["redirect"],
          finish: {
            method: "redirect",
            uri: "http://localhost:3000/injectPayment?projectID=" + projectID + "&amount=" + amount.toString() + "&timeStamp=" + (new Date().getTime()).toString(),
            nonce: "test",
          },
      }
    });

    console.log('\nStep 5: Got pending outgoing payment grant', outgoingPaymentGrant);

    // Store grant data in memory (for simplicity)
    grantData[sendingWalletAddress] = {
      outgoingPaymentGrant,
      client,
      sendingWallet,
      quote,

    };

    // Return the grant link to the client
    res.json({
      interactRedirect: outgoingPaymentGrant.interact.redirect,
      message: 'Please navigate to the provided URL to accept the grant.',
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
