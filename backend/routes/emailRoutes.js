import express from "express";
import {
  getTemplates,
  saveTemplate,
  renderTemplate,
  //   sendMail,
} from "../controllers/emailController.js";

const router = express.Router();

router.get("/templates", getTemplates);
router.post("/save", saveTemplate);
router.post("/render", renderTemplate);
// router.post("/send", sendMail);

export default router;
