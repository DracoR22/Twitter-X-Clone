import express from "express"
import { protectedRoute } from "../middleware/protected-route"
import { commentPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from "../controllers/post.controller"

const postRouter = express.Router()

postRouter.get("/all", protectedRoute, getAllPosts)
postRouter.get("/likes/:id", protectedRoute, getLikedPosts)
postRouter.get("/following", protectedRoute, getFollowingPosts)
postRouter.get("/user/:username", protectedRoute, getUserPosts)
postRouter.post("/create", protectedRoute, createPost)
postRouter.post("/comment/:id", protectedRoute, commentPost)
postRouter.post("/like/:id", protectedRoute, likeUnlikePost)
postRouter.delete("/delete/:id", protectedRoute, deletePost)

export default postRouter

