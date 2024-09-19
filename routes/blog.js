const { Router } = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

// Use memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user,
    blog: blog,
    comments: comments,
  });
});

router.get("/image/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || !blog.coverImage.data) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", blog.coverImage.contentType);
    res.send(blog.coverImage.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = new Blog({
    title,
    body,
    createdBy: req.user._id,
    coverImage: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },
  });

  await blog.save();
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
