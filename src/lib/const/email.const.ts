import type { User } from "$lib/server/db/models/auth.model";
import type { Business } from "$lib/server/db/models/business.model";
import type { UserReport } from "$lib/server/db/models/user_report.model";
import type { SendEmailOptions } from "$lib/services/email.service";
import { App } from "$lib/utils/app";
import { HTMLUtil } from "$lib/utils/html/html.util";
import { APP } from "./app.const";

const HTML_SIGNATURE = `
<p>
  Regards,<br />
  <a href="${APP.URL}">${APP.NAME}</a>
</p>`.trim();

const COMMON = {
  SIGNATURE: {
    HTML: HTML_SIGNATURE,
  },
};

export const EMAIL = {
  TEMPLATES: {
    "password-reset": (input: {
      url: string;
      user: Pick<User, "email" | "name">;
    }): SendEmailOptions => {
      const html = `
<p>Hi ${HTMLUtil.sanitize(input.user.name)}</p>
<p>
  Click <a href="${input.url}">here</a> to reset your ${APP.NAME} password.
</p>
<p>
  If you did not request this, you can safely ignore this email.
</p>

${COMMON.SIGNATURE.HTML}`.trim();

      return {
        html,
        to: input.user.email,
        subject: `Reset your ${APP.NAME} password`,
      };
    },

    "email-verification": (input: {
      url: string;
      user: Pick<User, "email" | "name">;
    }): SendEmailOptions => {
      const html = `
<p>Hi ${HTMLUtil.sanitize(input.user.name)},</p>
<p>
  Click <a href="${input.url}">here</a> to verify your ${APP.NAME} account.
</p>
<p>
  If you did not request this, you can safely ignore this email.
</p>

${COMMON.SIGNATURE.HTML}`.trim();

      return {
        html,
        to: input.user.email,
        subject: `Verify your ${APP.NAME} account`,
      };
    },

    "user-deleted": (input: {
      user: Pick<User, "email" | "name">;
    }): SendEmailOptions => {
      const html = `
<p>Hi ${HTMLUtil.sanitize(input.user.name)},</p>
<p>
  This is to confirm that your account associated with this email address has been successfully deleted from ${APP.NAME}.
</p>
<p>
  If you did not request this, please contact our support team immediately.
</p>

${COMMON.SIGNATURE.HTML}`.trim();

      return {
        html,
        to: input.user.email,
        subject: `Your ${APP.NAME} account has been deleted`,
      };
    },

    "delete-account-verification": (input: {
      user: Pick<User, "email" | "name">;
      url: string;
    }): SendEmailOptions => {
      const html = `
<p>Hi ${HTMLUtil.sanitize(input.user.name)},</p>
<p>
  We've received a request to delete your account associated with this email address from ${APP.NAME}.
</p>
<p>
  Please click <a href="${input.url}">here</a> to confirm the deletion.
</p>
<p>
  If you did not request this, please contact our support team immediately.
</p>

${COMMON.SIGNATURE.HTML}`.trim();

      return {
        html,
        to: input.user.email,
        subject: `Confirm Account Deletion for ${APP.NAME}`,
      };
    },

    "admin-contact-form": (input: {
      name: string;
      email: string;
      message: string;
    }): SendEmailOptions => {
      const html = `
<p>You have received a new message from the contact form on ${APP.NAME}.</p>

<p><strong>Name:</strong> ${HTMLUtil.sanitize(input.name)}</p>
<p><strong>Email:</strong> ${HTMLUtil.sanitize(input.email)}</p>

<p><strong>Message:</strong></p>
<p>${HTMLUtil.sanitize(input.message.replaceAll(/\n/g, "<br />"))}</p>

${COMMON.SIGNATURE.HTML}`.trim();

      return {
        html,
        to: "rossk29@gmail.com",
        subject: `New contact form submission from ${input.name}`,
      };
    },

    "admin-user-report-form": (input: {
      user_report: UserReport;
    }): SendEmailOptions => {
      const html = `
<p>New user report on ${APP.NAME}.</p>

<p><strong>Reason:</strong> ${HTMLUtil.sanitize(input.user_report.reason)}</p>
<p><strong>Resource:</strong> ${HTMLUtil.sanitize(input.user_report.resource_kind)}: ${HTMLUtil.sanitize(input.user_report.resource_id)}</p>

<p><strong>Message:</strong></p>
<p>${HTMLUtil.sanitize(input.user_report.details.replaceAll(/\n/g, "<br />"))}</p>

${COMMON.SIGNATURE.HTML}`.trim();

      return {
        html,
        to: "rossk29@pm.me",
        subject: `New user report`,
      };
    },

    "admin-new-business-form": (input: {
      business: Pick<Business, "name" | "slug">;
    }): SendEmailOptions => {
      const html = `
<p>New business on ${APP.NAME}.</p>

<p>
  <a href="${App.full_url(`/admin/businesses/${input.business.slug}`)}">
    ${HTMLUtil.sanitize(input.business.name)}
  </a>
</p>

${COMMON.SIGNATURE.HTML}`.trim();

      return {
        html,
        to: "rossk29@pm.me",
        subject: `New business: ${input.business.name}`,
      };
    },
  },
};
