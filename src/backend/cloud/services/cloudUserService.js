import { User } from "../model/User";

async function createUser(userName) {
  try {
    if (!userName) {
      throw new Error("No userName provided");
    }
    const newUser = new User({
      username: userName,
    });
    const savedUser = await newUser.save();
    return { success: true, message: "User created successfully", cloudId: savedUser._id };
  } catch (error) {
    return { success: false, message: "Error creating user", error: error.message };
  }
}

export { createUser };
