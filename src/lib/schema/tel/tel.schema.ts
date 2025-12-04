import { parsePhoneNumberFromString as parse_phone_number } from "libphonenumber-js/min";
import z from "zod";

export const tel_schema = z
  .string()
  .transform((tel) => parse_phone_number(tel, "ZA"))
  .refine((parsed) => parsed?.isValid(), "Invalid phone number")
  .transform((parsed) => parsed!.number);
