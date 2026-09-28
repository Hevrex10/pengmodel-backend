import cloudinary from "../config/cloudinary.js";
import Application from "../models/application.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";

export async function getAllApplication(req, res, next) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;

  const total = await Application.countDocuments();

  const features = APIFeatures(Application.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const applications = await features.query;
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    status: "success",
    results: applications.length,
    total,
    page,
    limit,
    totalPages,
    data: {
      applications,
    },
  });
}

export async function createApplication(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError("Please upload at least one photo", 400));
    }

    const photoUrls = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pengmodels/applications",
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

    const applicationData = {
      ...req.body,
      photos: photoUrls,
    };

    const application = await Application.create(applicationData);

    res.status(201).json({
      status: "success",
      data: {
        application,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function updateApplication(req, res, next) {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json({
      status: "success",
      data: {
        application,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req, res, next) {
  const application = await Application.findById(req.params.id);

  if (!application) {
    next(new AppError("No application found with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      application,
    },
  });
}

export async function deleteApplication(req, res, next) {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return next(new AppError("No application found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}
