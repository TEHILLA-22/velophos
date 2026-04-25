import smtplib
from email.mime.text import MIMEText
from app.core.config import SMTP_EMAIL, SMTP_PASSWORD


def send_otp_email(to_email: str, otp: str):
    subject = "Velophos Verification Code"
    body = f"Your OTP code is: {otp}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = "Velophos"
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())