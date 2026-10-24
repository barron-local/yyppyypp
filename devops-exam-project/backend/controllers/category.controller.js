const { readDb } = require('../config/db');

exports.getCategories = async (req, res, next) => {
  try {
    const db = readDb();
    return res.status(200).json({
      status: "success",
      message: "ดึงรายการหมวดหมู่สำเร็จ",
      data: db.categories || []
    });
  } catch (error) {
    next(error);
  }
};
