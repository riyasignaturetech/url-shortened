const express = require("express");
const router = express.Router();
const { register } = require("../controllers/Register/Register");
const { login } = require("../controllers/Login/Login");
const { createShortUrl, getUserLinks, toggleActive, deleteUrl, redirectToOriginalUrl } = require("../controllers/url");
const auth = require("../middleware/auth");

// Auth routes
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);

// Protected URL routes
router.post("/api/links", auth, createShortUrl);
router.get("/api/links", auth, getUserLinks);
router.patch("/api/links/:id/toggle", auth, toggleActive);
router.delete("/api/links/:id", auth, deleteUrl);

// Public redirect
router.get("/:shortCode", redirectToOriginalUrl);

module.exports = router;
