export interface PhotoTemplate {
  id: number;
  label: string;
  description: string;
  aspectRatio: "4/3";
  referenceImage: string;
  required: boolean;
  guidanceImage?: string; // Optional: URL for a silhouette or guide image
}

export interface CapturedPhoto {
  templateId: number;
  imageUrl: string; // base64 data URL
}
 