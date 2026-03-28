type OtpTemplateArgs = {
  codeDigits: string[];
  email: string;
};

export function renderWelcomeEmailHtml(displayName: string) {
  return `
    <div style="margin:0;padding:0;background:#0A0A0A;color:#e5e2e1;font-family:'Space Grotesk',Arial,sans-serif;">
      <style>
        @media only screen and (max-width: 680px) {
          .outer-wrap { padding: 0 !important; }
          .shell { border-radius: 12px !important; width: 100% !important; max-width: 100% !important; }
          .hdr { height: auto !important; padding: 14px 12px !important; }
          .hdr-brand { font-size: 12px !important; letter-spacing: 0.16em !important; }
          .hdr-state { font-size: 8px !important; letter-spacing: 0.12em !important; }
          .hero { padding: 22px 14px !important; }
          .welcome-title { font-size: 34px !important; line-height: 1.05 !important; }
          .welcome-copy { font-size: 14px !important; line-height: 1.7 !important; }
          .stack-col { display: block !important; width: 100% !important; box-sizing: border-box !important; }
          .stack-gap { display: block !important; height: 10px !important; }
          .security { padding: 16px 14px !important; }
          .footer { padding: 14px 12px !important; }
        }
        @media only screen and (max-width: 420px) {
          .outer-wrap { padding: 0 !important; }
          .hdr { padding: 12px 10px !important; }
          .hero { padding: 18px 10px !important; }
          .welcome-title { font-size: 30px !important; }
          .welcome-copy { font-size: 13px !important; line-height: 1.62 !important; }
          .security { padding: 14px 10px !important; }
          .footer { padding: 12px 10px !important; }
          .metric { padding: 12px !important; }
        }
      </style>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0A0A0A;">
        <tr>
          <td class="outer-wrap" style="padding:0;background:#0A0A0A;">
            <table class="shell" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0;background:#0A0A0A;border:1px solid #1a1a1a;border-radius:0;overflow:hidden;">
              <tr>
                <td class="hdr" style="height:72px;background:#000000;border-top:3px solid #7b2fff;padding:0 32px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="vertical-align:middle;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                          <tr>
                            <td style="width:10px;height:10px;background:#7b2fff;"></td>
                            <td style="width:10px;"></td>
                            <td class="hdr-brand" style="font-size:14px;font-weight:700;letter-spacing:0.25em;color:#ffffff;text-transform:uppercase;white-space:nowrap;">MONOLITH_AI</td>
                          </tr>
                        </table>
                      </td>
                      <td align="right" class="hdr-state" style="font-family:'IBM Plex Mono',Consolas,monospace;font-size:9px;color:#555555;letter-spacing:0.18em;text-transform:uppercase;white-space:nowrap;vertical-align:middle;">ACCESS_GRANTED</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td class="hero" style="padding:48px;background-color:#0D0D0D;background-image:linear-gradient(#1A1A1A 1px,transparent 1px),linear-gradient(90deg,#1A1A1A 1px,transparent 1px);background-size:24px 24px;border-bottom:1px solid #1C1B1B;">
                  <div style="margin-bottom:28px;display:flex;align-items:center;gap:8px;">
                    <span style="color:#00FF88;font-size:12px;line-height:1;">●</span>
                    <span style="font-family:'IBM Plex Mono',Consolas,monospace;font-size:11px;color:#00FF88;letter-spacing:0.18em;font-weight:600;text-transform:uppercase;">ACCOUNT_INITIALIZED</span>
                  </div>

                  <h1 class="welcome-title" style="margin:0 0 16px;font-size:42px;line-height:1.08;font-weight:700;color:#ffffff;letter-spacing:-0.02em;font-family:'Space Grotesk',Arial,sans-serif;">
                    Welcome,<br/>${displayName}.
                  </h1>

                  <p class="welcome-copy" style="margin:0 0 32px;max-width:420px;font-size:15px;line-height:1.8;color:#999999;font-family:'Space Grotesk',Arial,sans-serif;">
                    Your account is active and ready.
                    You now have full access to build,
                    analyze, and ship better products
                    with AI-powered UX intelligence.
                  </p>

                </td>
              </tr>

              <tr>
                <td class="security" style="background:#080808;padding:24px 48px;border-bottom:1px solid #131313;">
                  <div style="font-family:'IBM Plex Mono',Consolas,monospace;font-size:11px;line-height:1.6;color:#666666;">
                    <strong style="color:#888888;">NOTE:</strong>
                    IF YOU DID NOT CREATE THIS ACCOUNT,
                    CONTACT SUPPORT IMMEDIATELY.
                  </div>
                </td>
              </tr>

              <tr>
                <td class="footer" style="background:#000000;padding:24px 48px;text-align:center;border-bottom:3px solid rgba(123,47,255,0.2);">
                  <div style="font-family:'IBM Plex Mono',Consolas,monospace;font-size:9px;color:#333333;letter-spacing:0.14em;text-transform:uppercase;">
                    MONOLITH_AI - AI-POWERED UX INTELLIGENCE
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export function renderOtpEmailHtml({ codeDigits, email }: OtpTemplateArgs) {
  return `
    <div style="margin:0;padding:0;background:radial-gradient(circle at 50% 0%, rgba(123,47,255,0.08) 0%, transparent 50%), linear-gradient(180deg, #050505 0%, #0A0A0A 100%);min-height:100%;font-family:'Space Grotesk',Arial,sans-serif;color:#e5e2e1;">
      <style>
        @media only screen and (max-width: 680px) {
          .email-wrap { padding: 0 !important; }
          .email-card { border-radius: 12px !important; width: 100% !important; max-width: 100% !important; }
          .brand-name { font-size: 16px !important; letter-spacing: 0.13em !important; }
          .title { font-size: 32px !important; }
          .subtitle { font-size: 15px !important; line-height: 1.6 !important; }
          .otp-box { width: 42px !important; height: 56px !important; font-size: 30px !important; }
          .otp-gap { width: 6px !important; }
          .content-pad { padding: 22px 14px !important; }
          .security-pad { padding: 16px 14px !important; }
        }
        @media only screen and (max-width: 420px) {
          .email-wrap { padding: 0 !important; }
          .brand-name { font-size: 14px !important; letter-spacing: 0.09em !important; }
          .title { font-size: 27px !important; }
          .subtitle { font-size: 14px !important; line-height: 1.48 !important; }
          .otp-box { width: 32px !important; height: 44px !important; font-size: 20px !important; }
          .otp-gap { width: 4px !important; }
          .content-pad { padding: 18px 10px !important; }
          .security-pad { padding: 14px 10px !important; }
        }
      </style>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0A0A0A;">
        <tr>
          <td class="email-wrap" style="padding:0;background:#0A0A0A;">
            <table class="email-card" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:0;background:#0A0A0A;overflow:hidden;border-radius:0;box-shadow:none;border:1px solid #1A1A1A;">
              <tr>
                <td style="padding:20px 24px;background:#000000;border-top:2px solid #7b2fff;text-align:center;">
                  <div style="display:inline-flex;align-items:center;gap:10px;">
                    <span style="display:inline-block;width:12px;height:12px;background:#7b2fff;"></span>
                    <span class="brand-name" style="font-size:20px;font-weight:800;letter-spacing:0.18em;color:#ffffff;text-transform:uppercase;">MONOLITH_AI</span>
                  </div>
                  <div style="margin-top:6px;font-family:'IBM Plex Mono',Consolas,monospace;font-size:10px;color:#666666;letter-spacing:0.16em;text-transform:uppercase;">SECURE COMMUNICATION</div>
                </td>
              </tr>

              <tr>
                <td class="content-pad" style="padding:42px 34px;background-color:#0D0D0D;background-image:linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px);background-size:24px 24px;border-bottom:1px solid #1C1B1B;">
                  <div style="margin-bottom:20px;font-family:'IBM Plex Mono',Consolas,monospace;font-size:11px;color:#7b2fff;letter-spacing:0.14em;text-transform:uppercase;">ACCESS REQUEST</div>

                  <h1 class="title" style="margin:0 0 10px;font-size:42px;line-height:1.08;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Your access code</h1>
                  <p class="subtitle" style="margin:0 0 28px;font-size:16px;line-height:1.75;color:#9a9a9a;max-width:430px;">Use the one-time code below to authorize your current session, then enter it in the app.</p>

                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 30px;">
                    <tr>
                      ${codeDigits
                        .map(
                          (digit, index) =>
                            `<td class="otp-box" style="width:50px;height:64px;border:1px solid #3A2F50;background:#111111;font-family:'IBM Plex Mono',Consolas,monospace;font-size:36px;line-height:1;font-weight:700;color:#ffffff;text-align:center;vertical-align:middle;">${digit}</td>${index < codeDigits.length - 1 ? '<td class="otp-gap" style="width:8px;"></td>' : ""}`,
                        )
                        .join("")}
                    </tr>
                  </table>

                  <p style="margin:0;text-align:center;font-family:'IBM Plex Mono',Consolas,monospace;font-size:11px;line-height:1.6;color:#8f8f8f;letter-spacing:0.08em;text-transform:uppercase;">Enter code in app</p>
                </td>
              </tr>

              <tr>
                <td class="security-pad" style="background:#080808;padding:28px 34px;border-bottom:1px solid #131313;">
                  <div style="font-family:'IBM Plex Mono',Consolas,monospace;font-size:11px;line-height:1.7;color:#737373;">
                    <strong style="color:#9a9a9a;">SECURITY_NOTICE:</strong>
                    IF YOU DID NOT REQUEST THIS ACCESS CODE, PLEASE DISREGARD THIS EMAIL OR CONTACT YOUR SYSTEMS ADMINISTRATOR IMMEDIATELY. YOUR EMAIL ${email.toUpperCase()} HAS BEEN LOGGED FOR THIS TRANSACTION.
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:22px 16px 26px;text-align:center;background:#000000;">
                  <p style="margin:0;font-family:'IBM Plex Mono',Consolas,monospace;font-size:9px;color:#3b3b3b;letter-spacing:0.12em;text-transform:uppercase;">MONOLITH_AI ARCHITECTURAL INTELLIGENCE FRAMEWORK</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}
