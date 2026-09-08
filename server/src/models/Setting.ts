import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const settingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
}, { timestamps: { updatedAt: true, createdAt: false } });

const Setting = mongoose.model<ISetting>('Setting', settingSchema);

export default Setting;
