import Model from "../models/modelModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/appError.js";

export async function getAllModel(req, res, next) {
  const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
  const models = await features.query;

  res.status(200).json({
    status: "success",
    results: models.length,
    data: {
      models,
    },
  });
}

export async function createModel(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload an image or video",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "pengmodels",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(req.file.buffer);
    });

    const modelData = {
      ...req.body,
      ...(result.resource_type === "video"
        ? { videos: [result.secure_url] }
        : { photos: [result.secure_url] }),
    };

    const model = await Model.create(modelData);
    res.status(201).json({
      message: "success",
      data: {
        model,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getModel(req, res, next) {
  const model = await Model.findById(req.params.id);

  if (!model) {
    next(new AppError("No model found with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      model,
    },
  });
}

export async function updateModel(req, res, next) {
  try {
    const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        model,
      },
    });
  } catch (err) {
    next(err);
  }
}
