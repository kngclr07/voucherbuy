const { simpleParser } = require('mailparser');
const Imap = require('imap');
const { submissions } = require('./server');
require('dotenv').config();

const imap = new Imap({
  user: process.env.EMAIL,
  password: process.env.EMAIL_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
});

function checkInbox() {
  imap.once('ready', () => {
    imap.openBox('INBOX', false, () => {
      imap.search(['UNSEEN'], (err, results) => {
        if (err || !results.length) {
          imap.end();
          return;
        }

        const f = imap.fetch(results, { bodies: '' });
        f.on('message', msg => {
          msg.on('body', stream => {
            simpleParser(stream, (err, parsed) => {
              const text = parsed.text.trim();
              const match = parsed.subject?.match(/Voucher Request (\d+)/);
              if (match) {
                const id = match[1];
                if (submissions[id]) {
                  submissions[id].voucher = text;
                  console.log(`Voucher ${text} saved for ${id}`);
                }
              }
            });
          });
        });

        f.once('end', () => imap.end());
      });
    });
  });

  imap.once('error', err => console.log(err));
  imap.connect();
}

setInterval(checkInbox, 10000);
