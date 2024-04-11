import { User } from "../model/User";

async function createUser() {
  try {
    const newUser = new User();
    const savedUser = await newUser.save();
    console.log(savedUser._id)
    return { success: true, message: "User created successfully", cloudId: savedUser._id };
  } catch (error) {
    return { success: false, message: "Error creating user", error: error.message };
  }
}

export { createUser };
