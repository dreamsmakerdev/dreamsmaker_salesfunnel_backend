const AdminsModel = require('../model/adminModel');

const checkForAdmin = async () => {
  const admins = await AdminsModel.find({});

  if (admins.length > 0) return;

  const admin = new AdminsModel({
    name: 'admin',
    password: 'admin123',
    email: 'admin@gmail.com',
  });

  await admin.save();
};

module.exports = checkForAdmin;
