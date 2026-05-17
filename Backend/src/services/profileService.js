const User = require("../models/user");

const updateProfile = async (
    userId,
    profileData
) => {

    await User.update(
        {
            fullName: profileData.fullName,
            phone: profileData.phone,
            address: profileData.address,
            avatar: profileData.avatar
        },
        {
            where: {
                id: userId
            }
        }
    );

    const updatedUser =
        await User.findByPk(
            userId,
            {
                attributes: {
                    exclude: ['password']
                }
            }
        );

    return updatedUser;
};

module.exports = {
    updateProfile
};