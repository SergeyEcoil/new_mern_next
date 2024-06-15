import connectToDatabase from "../../../lib/mongodb";
import Note from "../../../models/Note";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await connectToDatabase();

  switch (method) {
    case "GET":
      try {
        const note = await Note.findById(id);
        if (!note) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const note = await Note.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!note) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: note });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const deletedNote = await Note.deleteOne({ _id: id });
        if (!deletedNote) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
