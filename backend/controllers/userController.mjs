import e from "express"
import AsyncHandler from "express-async-handler"
import User from "../models/userModel.mjs"
import generateToken from "../utils/generateToken.mjs"

//@desc   Auth user & get a token
//@route POST /api/user/login
//@access Public
const authUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error("Invalid Email or Password")
  }
})

//@desc   Register a new user
//@route POST /api/users
//@access Public
const registerUser = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User Already Exists")
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
  })
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid User Data")
  }
})

//@desc  Get user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

//@desc  Update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) user.password = req.body.password || user.password
    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
    res.json
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

//@desc  Get all user profile
//@route GET /api/users
//@access Private/Admin
const getUsers = AsyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

//@desc  delete a user
//@route DELETE /api/users/:id
//@access Private/Admin
const deleteUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.json({ message: "User Removed" })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

//@desc  Get user by ID
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password")
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

//@desc  Update user
//@route PUT /api/users/:id
//@access Private/Admin
const updateUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin
    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
    res.json
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
