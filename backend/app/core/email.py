import logging
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


def send_magic_link_email(email: str, token: str, base_url: str) -> bool:
    magic_link = f"{base_url}/auth/verify?token={token}"
    subject = "Your Login Link - Disaster Management System"

    html_body = f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Disaster Management System</h2>

        <p>Hello,</p>

        <p>
        Click the button below to log in to the Disaster Management System:
        </p>

        <a href="{magic_link}"
           style="display: inline-block; background: #2563eb; color: white;
              padding: 12px 24px; text-decoration: none; border-radius: 6px;
              margin: 16px 0;">
            Log In
        </a>

        <p style="font-size: 14px; color: #666; margin-top: 24px;">
            Or copy and paste this link into your browser:<br>
            <code
            style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">
                {magic_link}
            </code>
        </p>

        <p style="color: #dc2626; font-weight: 500;">
            This link is valid for 6 hours and can only be used once.
        </p>

        <hr
        style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

        <p style="font-size: 12px; color: #9ca3af;">
            If you did not request this login link, please ignore this email.
            <br>
            This is an automated message from Disaster Management System.
        </p>
    </div>
</body>
</html>
    """
    text_body = f"""Disaster Management System

Hello,
Click the link below to log in to the Disaster Management System:
{magic_link}
This link is valid for 6 hours and can only be used once.
If you did not request this, please ignore this email.
"""

    if settings.EMAIL_BACKEND == "console":
        logger.info("=" * 60)
        logger.info("MAGIC LINK EMAIL")
        logger.info("=" * 60)
        logger.info(f"To: {email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"\n{text_body}")
        logger.info("=" * 60)
        return True

    elif settings.EMAIL_BACKEND == "resend":
        return _send_via_resend(email, subject, html_body, text_body)

    else:
        logger.error(f"Unknown EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
        return False


def _send_via_resend(
    to_email: str, subject: str, html_body: str, text_body: str
) -> bool:
    import resend

    if not settings.RESEND_API_KEY:
        logger.error("RESEND_API_KEY not configured. Cannot send email.")
        return False

    try:
        resend.api_key = settings.RESEND_API_KEY

        params = {
            "from": settings.FROM_EMAIL,
            "to": to_email,
            "subject": subject,
            "html": html_body,
            "text": text_body,
        }

        email = resend.Emails.send(params)
        logger.info(f"Email sent via Resend. ID: {email.get('id', 'unknown')}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email via Resend: {e}")
        return False
