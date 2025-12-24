import { form } from "$app/server";
import { safe_get_session } from "$lib/auth/server";
import { UserReportSchema } from "$lib/server/db/models/user_report.model";
import { CaptchaService } from "$lib/services/captcha/captcha.service";
import { UserReportService } from "$lib/services/user_report/user_report.service";
import z from "zod";

export const create_user_report_remote = form(
  UserReportSchema.insert.extend({
    captcha_token: z.string().min(1, "Please complete the captcha"),
  }),
  async (input) => {
    const captcha = await CaptchaService.verify(input.captcha_token);
    if (!captcha.ok) {
      return captcha;
    }

    const session = await safe_get_session();

    return await UserReportService.create({
      ...input,
      user_id: session?.user.id,
    });
  },
);
