import { User } from "../model/User";

async function createUser(userName) {
  try {
    if (!userName) {
      throw new Error("No userName provided");
    }

    // Create a new user document
    const newUser = new User({
      username: userName,
    });

    // Save the new user document
    const savedUser = await newUser.save();

    // Return the new user's ID as cloudId
    return { success: true, message: "User created successfully", cloudId: savedUser._id };
  } catch (error) {
    return { success: false, message: "Error creating user", error: error.message };
  }
}

export { createUser };
