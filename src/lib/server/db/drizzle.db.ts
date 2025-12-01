import { DATABASE_URL } from "$env/static/private";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as AuthModels from "./models/auth.model";
import * as BusinessModel from "./models/business.model";
import * as SellerProfileModel from "./models/seller_profile.model";

const client = neon(DATABASE_URL);

const {
  AccountTable,
  PasskeyTable,
  SessionTable,
  UserTable,
  VerificationTable,
  ...auth_rest
} = AuthModels;

const { BusinessTable, ...business_rest } = BusinessModel;

const { SellerProfileTable, ...seller_profile_rest } = SellerProfileModel;

export const db = drizzle(client, {
  casing: "snake_case",
  schema: {
    // Auth
    user: UserTable,
    account: AccountTable,
    session: SessionTable,
    verification: VerificationTable,
    passkey: PasskeyTable,
    ...auth_rest,

    // Business
    business: BusinessTable,
    ...business_rest,

    // Seller Profile
    seller_profile: SellerProfileTable,
    ...seller_profile_rest,
  },
});
