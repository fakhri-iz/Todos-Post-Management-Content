import userModel from "../models/userModel.js";
import contentModel from "../models/contentModel.js";
import { mutateTalentSchema } from "../utils/schema.js";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

export const getTalents = async (req, res) => {
  try {
    const talents = await userModel
      .find({
        role: "talent",
        creator: req.user._id,
      })
      .select("name contents photo");

    const photoUrl = process.env.APP_URL + "/uploads/talents/";

    const response = talents.map((item) => {
      return {
        ...item.toObject(),
        photo_url: photoUrl + item.photo,
      };
    });

    return res.json({
      message: "Get talents success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
    });
  }
};

export const postTalent = async (req, res) => {
  try {
    const body = req.body;

    const parse = mutateTalentSchema.safeParse(body);

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

    const hashPassword = bcrypt.hashSync(body.password, 12);

    const talent = new userModel({
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      photo: req.file?.filename,
      creator: req.user?._id,
      role: "talent",
    });

    await talent.save();

    return res.json({
      message: "Create talent success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateTalents = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const parse = mutateTalentSchema
      .partial({
        password: true,
      })
      .safeParse(body);

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

    const talent = await userModel.findById(id);

    const hashPassword = parse.data?.password
      ? bcrypt.hashSync(parse.data.password, 12)
      : talent.password;

    await userModel.findByIdAndUpdate(id, {
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      photo: req?.file ? req.file?.filename : talent.photo,
    });

    return res.json({
      message: "Update talent success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteTalent = async (req, res) => {
  try {
    const { id } = req.params;
    const talent = await userModel.findById(id);

    await contentModel.findOneAndUpdate(
      {
        talents: id,
      },
      {
        $pull: {
          talents: id,
        },
      }
    );

    const dirname = path.resolve();

    const filePath = path.join(dirname, "public/uploads/talents", talent.photo);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await userModel.findByIdAndDelete(id);

    return res.json({
      message: "Delete talent success",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Internal server error",
    });
  }
};
