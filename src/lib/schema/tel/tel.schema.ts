import parsePhoneNumber from "libphonenumber-js/min";
import z from "zod";

export const tel_schema = z
  .string()
  .transform((tel) => parsePhoneNumber(tel, "ZA"))
  .refine((parsed) => parsed?.isValid(), "Invalid phone number")
  .transform((parsed) => parsed!.number);
