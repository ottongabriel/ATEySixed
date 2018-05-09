const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const tipSchema = new Schema({
  // _id: ObjectId
  item: String,
  restaurant_id: String,
  owner_id: Schema.Types.ObjectId,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Tip = mongoose.model("Tip", tipSchema);
module.exports = Tip;