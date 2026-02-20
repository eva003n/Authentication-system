import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const homePage = asyncHandler(async(req, res) => {
    res.render("home", {})
});

export {
    homePage
}