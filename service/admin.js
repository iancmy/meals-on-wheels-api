// Check permissions

import Admin from "../model/Admin.js";

export const getPermissions = async (req, res, next) => {
  const { userId } = req;

  try {
    // Get permissions
    const adminUser = await Admin.findById(userId);

    if (!adminUser) {
      return res.status(401).json({ msg: "Unauthorized access!" });
    }

    req.permissions = adminUser.permissions;

    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
