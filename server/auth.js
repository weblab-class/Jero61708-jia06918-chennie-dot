import express from "express";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Missing credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const user = {
      name: payload?.name,
      email: payload?.email,
      picture: payload?.picture,
    };

    req.session.user = user;
    res.json(user);
  } catch (e) {
    res.status(401).json({ error: "Invalid login" });
  }
});

// GET /api/whoami
router.get("/whoami", (req, res) => {
  res.json(req.session.user || null);
});

// POST /api/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

export default router;
module.exports = { populateCurrentUser, authRouter };
