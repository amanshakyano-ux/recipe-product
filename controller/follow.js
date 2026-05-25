const { Follow, User } = require("../models");

const followUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const followId = Number(req.params.followId);
    if (isNaN(followId) || followId <= 0 || !followId) {
      return res.status(400).json({
        success: false,
        message: "Invalid followId",
      });
    }
    const userToFollow = await User.findByPk(followId);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User to follow not found",
      });
    }
    if (userId === followId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }
    const isFollowing = await Follow.findOne({
      where: {
        followerId: userId,
        followingId: followId,
      },
    });
    if (isFollowing) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user",
      });
    }

    const follow = await Follow.create({
      followerId: userId,
      followingId: followId,
    });
    res.status(201).json({
      success: true,
      message: "User followed successfully",
      follow,
    });
  } catch (err) {
    next(err);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const followId = Number(req.params.followId);
    if (isNaN(followId) || followId <= 0 || !followId) {
      return res.status(400).json({
        success: false,
        message: "Invalid followId",
      });
    }
    const userToFollow = await User.findByPk(followId);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User to unfollow not found",
      });
    }

    if (userId === followId) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself",
      });
    }

    const isFollowing = await Follow.findOne({
      where: {
        followerId: userId,
        followingId: followId,
      },
    });
    if (!isFollowing) {
      return res
        .status(400)
        .json({ success: false, message: "You are not following this user" });
    }
    await isFollowing.destroy();
    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (err) {
    next(err);
  }
};
const getFollowers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const followers = await Follow.findAll({ where: { followingId: userId } });
    if (followers.length === 0) {
       return res.status(200).json({
    success: true,
    totalFollowers: 0,
    followers: [],
  });
    }
    res.status(200).json({
      success: true,
      totalFollowers: followers.length,
      followers,
    });
  } catch (err) {
    next(err);
  }
};
const getFollowing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const following = await Follow.findAll({ where: { followerId: userId } });
    if (following.length === 0) {
      return res.status(200).json({
    success: true,
    totalFollowing: 0,
    following: [],
  });
    }
    res.status(200).json({
      success: true,
      totalFollowing: following.length,
      following,
    });
  } catch (err) {
    next(err);
  }
};

const getUserFollowers = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const followers = await Follow.findAll({ where: { followingId: userId } });
    if (followers.length === 0) {
      return res.status(200).json({
        success: true,
        totalFollowers: 0,
        followers: [],
      });
    }
    res.status(200).json({
      success: true,
      totalFollowers: followers.length,
      followers,
    });
  } catch (err) {
    next(err);
  }
};

const getUserFollowing = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const following = await Follow.findAll({ where: { followerId: userId } });
    if (following.length === 0) {
      return res.status(200).json({
        success: true,
        totalFollowing: 0,
        following: [],
      });
    }
    res.status(200).json({
      success: true,
      totalFollowing: following.length,
      following,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowing, getUserFollowers, getUserFollowing };
