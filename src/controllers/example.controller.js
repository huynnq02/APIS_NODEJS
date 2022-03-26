//#region for logic
export const TestingController = {
  serverTesting: async (req, res) => {
    try {
      res.send({ message: "Dan" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  accountTesting: async (req, res) => {
    const { email, password } = req.body;
    try {
      res.send({ email });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};
