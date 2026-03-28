import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
    }
  },
  { timestamps: true }
);

// 🔥 FIXED (no next)
categorySchema.pre("save", function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

export default mongoose.model("Category", categorySchema);