import contentModel from "../models/contentModel.js";
import { mutateContentSchema } from "../utils/schema.js";
import fs from "fs";
import path from "path";
import platformModel from "../models/platformModel.js";
import userModel from "../models/userModel.js";
import contentDetailModel from "../models/contentDetailModel.js";
import { title } from "process";

export const getContents = async (req, res) => {
  try {
    const contents = await contentModel
      .find({
        creator: req.user?._id,
      })
      .select("name thumbnail")
      .populate({
        path: "platform",
        select: "name -_id",
      })
      .populate({
        path: "talents",
        select: "name",
      });

    const imageUrl = process.env.APP_URL + "/uploads/contents/";

    const response = contents.map((item) => {
      return {
        ...item.toObject(),
        thumbnail_url: imageUrl + item.thumbnail,
        total_talent: item.talents.length,
      };
    });

    return res.json({
      message: "Get content success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getPlatforms = async (req, res) => {
  try {
    const platforms = await platformModel.find();

    return res.json({
      message: "Get platform success",
      data: platforms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await contentModel
      .findById(id)
      .populate({
        path: "platform",
        select: "name -_id",
      })
      .populate({
        path: "details",
        select: "title type",
      });

    return res.json({
      message: "Get content detail success",
      data: content,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const postContent = async (req, res) => {
  try {
    const body = req.body;

    const parse = mutateContentSchema.safeParse(body);

    if (!parse.success) {
      const errorMessages = parse.error.issues.map((err) => err.message);

      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req?.file?.path);
      }

      return res.status(500).json({
        message: "Error Validation",
        data: null,
        errors: errorMessages,
      });
    }

    const platform = await platformModel.findById(parse.data.platformId);

    if (!platform) {
      return res.status(500).json({
        message: "Platform Id not found",
      });
    }

    const content = new contentModel({
      name: parse.data.name,
      platform: platform._id,
      description: parse.data.description,
      tagline: parse.data.tagline,
      thumbnail: req.file?.filename,
      creator: req.user._id,
    });

    await content.save();

    await platformModel.findByIdAndUpdate(
      platform._id,
      {
        $push: {
          contents: content._id,
        },
      },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      req.user?._id,
      {
        $push: {
          contents: content._id,
        },
      },
      { new: true }
    );

    return res.json({ message: "Create Content Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateContent = async (req, res) => {
  try {
    const body = req.body;
    const contentId = req.params.id;

    const parse = mutateContentSchema.safeParse(body);

    if (!parse.success) {
      const errorMessages = parse.error.issues.map((err) => err.message);

      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req?.file?.path);
      }

      return res.status(500).json({
        message: "Error Validation",
        data: null,
        errors: errorMessages,
      });
    }

    const platform = await platformModel.findById(parse.data.platformId);
    const oldContent = await contentModel.findById(contentId);

    if (!platform) {
      return res.status(500).json({
        message: "Platform Id not found",
      });
    }

    await contentModel.findByIdAndUpdate(contentId, {
      name: parse.data.name,
      platform: platform._id,
      description: parse.data.description,
      tagline: parse.data.tagline,
      thumbnail: req?.file ? req.file?.filename : oldContent.thumbnail,
      creator: req.user._id,
    });

    return res.json({ message: "Update Content Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await contentModel.findById(id);

    const dirname = path.resolve();

    const filePath = path.join(
      dirname,
      "public/uploads/contents",
      content.thumbnail
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await contentModel.findByIdAndDelete(id);

    return res.json({
      message: "Delete content success",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
    });
  }
};

export const postMaterialContent = async (req, res) => {
  try {
    const body = req.body;

    const content = await contentModel.findById(body.contentId);

    const material = new contentDetailModel({
      title: body.title,
      type: body.type,
      content: content._id,
      text: body.text,
      videoId: body.videoId,
    });

    await material.save();

    await contentModel.findByIdAndUpdate(
      content._id,
      {
        $push: {
          details: material._id,
        },
      },
      { new: true }
    );

    return res.json({ message: "Create material content success" });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
    });
  }
};

export const updateMaterialContent = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const content = await contentModel.findById(body.contentId);

    await contentDetailModel.findByIdAndUpdate(
      id,
      {
        title: body.title,
        type: body.type,
        content: content._id,
        text: body.text,
        videoId: body.videoId,
      },
      { new: true }
    );

    return res.json({ message: "Update material content success" });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
    });
  }
};

export const deleteMaterialContent = async (req, res) => {
  try {
    const { id } = req.params;

    await contentDetailModel.findByIdAndDelete(id);

    return res.json({
      message: "Delete material content success",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
    });
  }
};
