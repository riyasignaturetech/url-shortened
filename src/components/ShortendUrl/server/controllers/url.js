const Url = require("../models/Url");
const validateUrl = require("../utils/ValidateUrl");
const generateUniqueId = require("../utils/generateUniqueId");

async function createShortUrl(req, res) {
  const { title, url, startTime, endTime } = req.body;
  if (!title || !url)
    return res.status(400).json({ message: "Title and URL are required" });
  if (!validateUrl(url))
    return res.status(400).json({ message: "Invalid URL" });

  try {
    const shortCode = await generateUniqueId();
    const newUrl = await Url.create({
      userId: req.userId,
      title,
      url,
      shortCode,
      startTime: startTime || null,
      endTime: endTime || null,
    });
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    res.status(201).json({ ...newUrl.toObject(), shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getUserLinks(req, res) {
  try {
    const links = await Url.find({ userId: req.userId }).sort({ createdAt: -1 });
    const base = process.env.BASE_URL;
    const result = links.map((l) => ({ ...l.toObject(), shortUrl: `${base}/${l.shortCode}` }));
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function toggleActive(req, res) {
  try {
    const link = await Url.findOne({ _id: req.params.id, userId: req.userId });
    if (!link) return res.status(404).json({ message: "Link not found" });
    link.isActive = !link.isActive;
    await link.save();
    res.status(200).json({ isActive: link.isActive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteUrl(req, res) {
  try {
    const deleted = await Url.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: "Link not found" });
    res.status(200).json({ message: "Link deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function redirectToOriginalUrl(req, res) {
  const { shortCode } = req.params;
  try {
    const link = await Url.findOne({ shortCode });
    if (!link) return res.status(404).json({ message: "Link not found" });
    if (!link.isActive) return res.status(410).json({ message: "Link is inactive" });

    const now = new Date();
    if (link.startTime && now < link.startTime)
      return res.status(403).json({ message: "Link is not active yet" });
    if (link.endTime && now > link.endTime)
      return res.status(410).json({ message: "Link has expired" });

    await Url.findByIdAndUpdate(link._id, { $inc: { clicks: 1 } });
    return res.redirect(link.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createShortUrl, getUserLinks, toggleActive, deleteUrl, redirectToOriginalUrl };
