import Model from "../models/modelModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/appError.js";

export async function getAllModel(req, res, next) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  const total = await Model.countDocuments();

  const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
  const models = await features.query;
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: "success",
    results: models.length,
    total,
    page,
    limit,
    totalPages,
    data: {
      models,
    },
  });
}

export async function createModel(req, res, next) {
  try {
    const photos = req.files?.photos || [];
    const videos = req.files?.videos || [];

    if (photos.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload at least one photo",
      });
    }

    const photoUrls = [];
    const videoUrls = [];

    for (const file of photos) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pengmodels",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(file.buffer);
      });

      photoUrls.push(result.secure_url);
    }

    for (const file of videos) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pengmodels",
            resource_type: "video",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        uploadStream.end(file.buffer);
      });

      videoUrls.push(result.secure_url);
    }

    const modelData = {
      ...req.body,
      photos: photoUrls,
      videos: videoUrls,
    };

    const model = await Model.create(modelData);

    res.status(201).json({
      status: "success",
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
