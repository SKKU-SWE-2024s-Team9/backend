import express from "express";
import multer from "multer";
import path from "node:path";
import { v4 } from "uuid";
import { staticPath } from "../../util/path";
import { INTERNAL_SERVER_ERROR, OK } from "../../util/status-code";

const router = express.Router();

const uploadImage = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      const ext = file.originalname.split(".").at(-1);
      done(null, `${v4()}.${ext}`);
    },
    destination(req, file, done) {
      done(null, path.join(staticPath, "image"));
    },
  }),
});
router.use(uploadImage.single("file"));

router.post("/image", (req, res) => {
  if (!req.file) res.status(INTERNAL_SERVER_ERROR).end();
  res.status(OK).json({ path: `/image/${req.file?.filename}` });
});

export default router;
