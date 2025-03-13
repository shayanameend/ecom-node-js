const auth = {
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

const category = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
};

const vendor = {
  id: true,
  pictureId: true,
  name: true,
  description: true,
  postalCode: true,
  phone: true,
  city: true,
  pickupAddress: true,
  createdAt: true,
  updatedAt: true,
};

const product = {
  id: true,
  pictureIds: true,
  name: true,
  description: true,
  sku: true,
  stock: true,
  price: true,
  salePrice: true,
  createdAt: true,
  updatedAt: true,
};

const review = {
  id: true,
  rating: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
};

export const publicSelector = {
  auth,
  category,
  vendor,
  product,
  review,
};
