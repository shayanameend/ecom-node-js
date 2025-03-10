import { OtpType } from "@prisma/client";
import { default as zod } from "zod";

const signUpBodySchema = zod.object({
  email: zod
    .string({
      message: "Invalid Email",
    })
    .email({
      message: "Invalid Email",
    }),
  password: zod
    .string({
      message: "Invalid Password",
    })
    .min(8, {
      message: "Password is too short",
    })
    .max(32, {
      message: "Password is too long",
    }),
});

const signInBodySchema = zod.object({
  email: zod
    .string({
      message: "Invalid Email",
    })
    .email({
      message: "Invalid Email",
    }),
  password: zod
    .string({
      message: "Invalid Password",
    })
    .min(8, {
      message: "Password is too short",
    })
    .max(32, {
      message: "Password is too long",
    }),
});

const forgotPasswordBodySchema = zod.object({
  email: zod
    .string({
      message: "Invalid Email",
    })
    .email({
      message: "Invalid Email",
    }),
});

const resendOtpBodySchema = zod.object({
  type: zod
    .enum([OtpType.VERIFY, OtpType.RESET], {
      message: "Invalid Type",
    })
    .default(OtpType.VERIFY),
});

const verifyOtpBodySchema = zod.object({
  otp: zod
    .string({
      message: "Invalid OTP",
    })
    .length(6, {
      message: "Invalid OTP",
    }),
  type: zod
    .enum([OtpType.VERIFY, OtpType.RESET], {
      message: "Invalid Type",
    })
    .default(OtpType.VERIFY),
});

const updatePasswordBodySchema = zod.object({
  password: zod
    .string({
      message: "Invalid Password",
    })
    .min(8, {
      message: "Password is too short",
    })
    .max(32, {
      message: "Password is too long",
    }),
});

export {
  signUpBodySchema,
  signInBodySchema,
  forgotPasswordBodySchema,
  resendOtpBodySchema,
  verifyOtpBodySchema,
  updatePasswordBodySchema,
};
