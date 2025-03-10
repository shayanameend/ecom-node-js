import * as zod from "zod";

const createAdminProfileBodySchema = zod.object({
  name: zod
    .string({
      message: "Name must be a string!",
    })
    .min(3, {
      message: "Name must be at least 3 characters!",
    })
    .max(255, {
      message: "Name must be at most 255 characters!",
    }),
  phone: zod
    .string({
      message: "Phone must be a string!",
    })
    .min(3, {
      message: "Phone must be at least 3 characters!",
    })
    .max(255, {
      message: "Phone must be at most 255 characters!",
    }),
});

const updateAdminProfileBodySchema = zod.object({
  pictureId: zod
    .string()
    .length(40, {
      message: "Picture ID is invalid!",
    })
    .optional(),
  name: zod
    .string({
      message: "Name must be a string!",
    })
    .min(3, {
      message: "Name must be at least 3 characters!",
    })
    .max(255, {
      message: "Name must be at most 255 characters!",
    })
    .optional(),
  phone: zod
    .string({
      message: "Phone must be a string!",
    })
    .min(3, {
      message: "Phone must be at least 3 characters!",
    })
    .max(255, {
      message: "Phone must be at most 255 characters!",
    })
    .optional(),
});

export { createAdminProfileBodySchema, updateAdminProfileBodySchema };
