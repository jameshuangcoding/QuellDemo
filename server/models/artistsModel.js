const Album = require("./albumsModel");
const Songs = require("./songsModel");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  name: { type: String, require: true },
});
//artists

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;
