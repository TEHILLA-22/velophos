import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import SMTP_EMAIL, SMTP_PASSWORD

def send_otp_email(to_email: str, otp: str):
    subject = f"{otp} is your Velophos verification code"
    
    # Professional HTML content
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 40px;
                background-color: #050505;
                color: #ffffff;
                border-radius: 20px;
                text-align: center;
            }}
            .logo {{
                font-size: 24px;
                letter-spacing: 5px;
                font-weight: 300;
                margin-bottom: 40px;
                color: #ffffff;
            }}
            .otp {{
                font-size: 48px;
                font-weight: 600;
                margin: 40px 0;
                letter-spacing: 8px;
                color: #6366f1;
            }}
            .footer {{
                color: #666666;
                font-size: 13px;
                margin-top: 40px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">VELOPHOS</div>
            <p style="font-size: 16px; color: #a5b4fc;">Use the code below to verify your account</p>
            <div class="otp">{otp}</div>
            <p style="font-size: 14px; color: #888;">If you didn't request this, you can safely ignore this email.</p>
            <div class="footer">
                &copy; 2026 Velophos Intelligence. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Velophos <{SMTP_EMAIL}>"
    msg["To"] = to_email

    part1 = MIMEText(f"Your Velophos verification code is: {otp}", "plain")
    part2 = MIMEText(html_content, "html")

    msg.attach(part1)
    msg.attach(part2)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())