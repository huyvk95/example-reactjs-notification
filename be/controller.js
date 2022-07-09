const crypto = require("crypto");
const webpush = require("web-push");
const subscriptions = {};

const vapidKeys = {
  privateKey: "bdSiNzUhUP6piAxLH-tW88zfBlWWveIx0dAsDO66aVU",
  publicKey:
    "BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const createHash = (input) => {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
};

const handleSubscription = (req, res) => {
  const { data } = req.body;
  const id = createHash(JSON.stringify(data));
  subscriptions[id] = data;
  req.status(201).json({ id });
};

const handlePushNotification = (req, res) => {
  const id = req.params.id;
  const subscription = subscriptions[id];
  webpush
    .sendNotification(
      subscription,
      JSON.stringify({
        title: "New Product Available",
        text: "HEY! Take a look at this brand new t-shirt!",
        image: "/images/noti-img.jpg",
        tag: "new-product",
        url: "/new-product.html",
      })
    )
    .catch((err) => console.log(err));

  res.status(202).json({});
};

module.exports = { handleSubscription, handlePushNotification };
