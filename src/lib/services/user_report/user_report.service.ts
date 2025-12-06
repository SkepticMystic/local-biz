import { EMAIL } from "$lib/const/email.const";
import { UserReportRepo } from "$lib/repos/user_report.repo";
import {
  UserReportTable,
  type UserReport,
} from "$lib/server/db/models/user_report.model";
import { result } from "$lib/utils/result.util";
import { AdapterService } from "../adapter/adapter.service";
import { EmailService } from "../email.service";
import { ResourceService } from "../resource/resource.service";

export const UserReportService = {
  create: async (
    input: Omit<
      typeof UserReportTable.$inferInsert,
      "ip_address" | "user_agent"
    >,
  ): Promise<App.Result<UserReport>> => {
    const [resource] = await Promise.all([
      ResourceService.get_by_kind_and_id(input),
    ]);

    if (!resource) {
      return result.err({ message: "Resource not found" });
    }

    const res = await UserReportRepo.create({
      ...input,
      ip_address: AdapterService.get_ip(),
      user_agent: AdapterService.get_user_agent(),
    });

    if (res.ok) {
      await EmailService.send(
        EMAIL.TEMPLATES["admin-user-report-form"]({ user_report: res.data }),
      );
    }

    return res;
  },
};
