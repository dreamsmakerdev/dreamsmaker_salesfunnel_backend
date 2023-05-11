const LayoutModel = require("../../model/layoutModel");

exports.getPageLayout = async (req, res) => {
    try {
        const layoutData = await LayoutModel.find();

        if (layoutData.length < 1) {
            return res.failureResponse({ message: "No data found" });
        }

        return res.ok({
            message: "Got page layout",
            data: layoutData[0],
        });
    } catch (error) {
        return res.failureResponse();
    }
};
