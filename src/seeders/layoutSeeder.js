const LayoutModel = require("../model/layoutModel");
const { uploadLayoutFromFilePath } = require("../utils/fileHelper");

const checkForLayout = async () => {
    try {
        const layouts = await LayoutModel.find({});

        if (layouts.length > 0) {
            return;
        }

        const dBObject = {};

        const landingBGVideo = await uploadLayoutFromFilePath(
            __dirname + "/../baseAssets/landingBgVideo.mp4"
        );
        dBObject.landing = { title: "DreamMakers", backgroundVideo: landingBGVideo.path };

        const mintCheckerImage = await uploadLayoutFromFilePath(
            __dirname + "/../baseAssets/mintCheckerImg.png"
        );
        dBObject.mintChecker = {
            cardTitle: "WANT A PIECE OF FUTURE?",
            image: mintCheckerImage.path,
            heading: "The Benefits Of Having Dreamsmaker NFT :",
            description: `1. +50.000$ USD Fund to Finance Community Creations<br>2. Exclusive Access Seed & Pre-sales<br>3. Early access to New Gaming Exchange with +200$ USD Credit GGToro.com<br>4. Exclusive access to Discord with other Club Members<br>5. Digital Gaming Identity<br>6. Reward  and Gifts Up to +100.000$ USD<br>7. Exclusive Upgrades on the Game Fusion of Forces between Space Ships`,
        };

        const discordVideo = await uploadLayoutFromFilePath(
            __dirname + "/../baseAssets/discordViewVideo.mp4"
        );

        const firstWinnerProfile = await uploadLayoutFromFilePath(
            __dirname + "/../baseAssets/firstWinnerProfile.png"
        );

        const secondWinnerProfile = await uploadLayoutFromFilePath(
            __dirname + "/../baseAssets/secondWinnerProfile.png"
        );

        const thirdWinnerProfile = await uploadLayoutFromFilePath(
            __dirname + "/../baseAssets/thirdWinnerProfile.png"
        );
        dBObject.discord = {
            description:
                "Join Our Discord And Participate In The Next Dreams Maker Creator Contest.",
            discordUrl: "https://discord.com/invite/Q6ehRDTPdG",
            video: discordVideo.path,
            firstWinner: { name: "Vini", logo: firstWinnerProfile.path },
            secondWinner: { name: "Tosco_E", logo: secondWinnerProfile.path },
            thirdWinner: { name: "JstFredrik", logo: thirdWinnerProfile.path },
        };

        const partners = [];
        i = 1;
        while (i <= 6) {
            let partnerLogo = await uploadLayoutFromFilePath(
                __dirname + `/../baseAssets/partner-${i}.png`
            );
            partners.push({ logo: partnerLogo.path, link: "" });
            i++;
        }

        let partnerImage = await uploadLayoutFromFilePath(
            __dirname + `/../baseAssets/partner-bannerImg.png`
        );
        dBObject.partners = {
            bannerImg: partnerImage.path,
            description:
                "Dreamsmaker uses the latest in AI, game engines, NFT, blockchain to bring you in your second life. Join the Future.",
            list: partners,
        };

        dBObject.links = [];
        dBObject.links.push({ name: "Instagram", link: "" });
        dBObject.links.push({ name: "Discord", link: "https://discord.com/invite/Q6ehRDTPdG" });
        dBObject.links.push({ name: "Twitter", link: "" });
        dBObject.links.push({ name: "Youtube", link: "" });
        dBObject.links.push({ name: "Tiktok", link: "" });

        dBObject.footerText =
            "We are the Future. Dreamsmaker uses the latest in AI, game engines, NFT, blockchain to bring you in your second life. Join the Future.";

        const layout = new LayoutModel(dBObject);

        await layout.save();
    } catch (err) {
        console.log("🚀 ~ file: layoutSeeder.js:66 ~ checkForLayout ~ err:", err);
    }
};

module.exports = checkForLayout;

