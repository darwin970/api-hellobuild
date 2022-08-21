const express = require("express");
const axios = require("axios");

const router = express.Router();

const COOKIE_ACCESS_TOKEN = "access-token";

router.get("/github/all-repositories", async (request, response) => {
    const accessToken = request.cookies[COOKIE_ACCESS_TOKEN];
    const data = await axios
        .get("https://api.github.com/user/repos", {
        headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => res.data)
        .catch((error) => {
            console.error(error);
            throw error;
        });

    response.json(data);
});

module.exports = router;