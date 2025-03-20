// Define an interface representing the structure of rescue objects
export interface Rescue {
  _id: string;
  name: string;
  slug: string;
  sex: string;
  age: string;
  size: string;
  vetStatus: string;
  description: string;
  featureImage: string;
  galleryImages: string[];
  availability: string;
}
