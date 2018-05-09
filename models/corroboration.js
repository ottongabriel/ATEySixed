const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const corroborationSchema = new Schema({
  //_id: ObjectId is in the database
  corroborated: Boolean,
  tip_id: Schema.Types.ObjectId,
  owner_id: Schema.Types.ObjectId,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Corroboration = mongoose.model("Corroboration", corroborationSchema);
module.exports = Corroboration;