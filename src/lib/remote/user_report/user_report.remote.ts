import { form } from "$app/server";
import { safe_get_session } from "$lib/auth/server";
import { UserReportSchema } from "$lib/server/db/models/user_report.model";
import { UserReportService } from "$lib/services/user_report/user_report.service";

export const create_user_report_remote = form(
  UserReportSchema.insert,
  async (input) => {
    const session = await safe_get_session();

    return await UserReportService.create({
      ...input,
      user_id: session?.user.id,
    });
  },
);
