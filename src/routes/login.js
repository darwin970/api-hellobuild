const express = require("express");
const axios = require("axios")
const queryString = require("query-string");
const jwt = require("jsonwebtoken");

const router = express.Router();

const GITHUB_CLIENT_ID = "c7d03538e3726b517300";
const GITHUB_CLIENT_SECRET = "9be3b9503c3c3db17c23fb0b5e98be7d445f084f";
const COOKIE_NAME = "github-jwt";
const COOKIE_ACCESS_TOKEN = "access-token";
const secret = "pruebaaaa";

async function getGitHubUser(code, response) {
    const githubToken = await axios
        .post(`https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error;
        });

    const decoded = queryString.parse(githubToken);
    
    if (decoded.error) {
        throw new Error(decoded.error);
    }

    const accessToken = decoded.access_token;
    response.cookie(COOKIE_ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        domain: "localhost",
      });

    return axios
        .get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => res.data)
        .catch((error) => {
        console.error(`Error getting user from GitHub`);
            throw error;
        });
}

router.get("/auth/github", async (request, response) => {
    const { code, path } = request.query;

    if (!code) {
        throw new Error("No code!");
    }

    const gitHubUser = await getGitHubUser(code, response);
    const token = jwt.sign(gitHubUser, secret);

    response.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        domain: "localhost",
      });

    response.redirect(`http://localhost:3000${path}`);
});

router.get("/auth/logout", (request, response) => {

    response.cookie(COOKIE_NAME, null, {
        httpOnly: true,
        domain: "localhost",
      });

    response.json({ message: 'Se finalizo la sesión' });
});

router.get("/me", (request, response) => {
    const cookie = request.cookies[COOKIE_NAME];

    try {
        const decode = jwt.verify(cookie, secret);
        return response.send(decode);
    } catch (e) {
        return response.send(null);
    }
  });

module.exports = router;