const adUtils = require("./adUtility");

// ************************* Upload single ads ********************
const handleAdUpload = async (req, res) => {
  try {
    // console.log(req.body);

    await adUtils.adUploadCommonLogic(res, req, req.body, "single");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something  went wrong");
  }
};
exports.handleAdUpload = handleAdUpload;
