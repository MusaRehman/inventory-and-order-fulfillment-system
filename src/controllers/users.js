// import seq

export const createUser = async (req, res) => {
  try {
    const { name, description } = req.body;
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
    