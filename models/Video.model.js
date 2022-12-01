
const { Schema, model } = require('mongoose');

const videoSchema = new Schema(
    {
      title: String,
      description: String,
      owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      image: String,
      thumbnail: String,
      date: String,
      reviews: [{type: Schema.Types.ObjectId, ref: "Review"}]
    }
  );

  const Video = model("video", videoSchema);

  module.exports = Video;