const CronJobManager = require("cron-job-manager");

const { nftPriceUpdate } = require("../controller/web/nftController");
const { checkSession } = require("../controller/web/stripeController");

const manager = new CronJobManager();

manager.add(
    "nftPriceUpdate",
    "*/5 * * * *",
    () => {
        nftPriceUpdate();
    },
    {
        start: false,
        timeZone: "Asia/Kolkata",
    }
);
manager.add(
    "checkSession",
    "*/5 * * * *",
    () => {
        checkSession();
    },
    {
        start: false,
        timeZone: "Asia/Kolkata",
    }
);

module.exports = { manager };

