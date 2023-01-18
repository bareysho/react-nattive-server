import nodemailer from '@config/nodemailer';

export class EmailNotificationService {
  public static sendEmail = async (emailToken: string, mailTo: string) => {
    return nodemailer.sendMail({
      from: '"Fitness Workout Plan" <bbareysho@gmail.com>',
      to: mailTo,
      subject: 'Email verification',
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Fitness Workout Plan</a>
    </div>
    <p style="font-size:1.1em">Привет,</p>
    <p>Используйте данный код для продолжения процесса подтверждения почты.
    <b>НИКОМУ</b> не передавайте данный код. Код будет действителен в течении 10 минут.</p>
    <h2 style="background: #fff200;margin: 0 auto;width: max-content;padding: 0 10px;color: #000;border-radius: 4px;">${emailToken}</h2>
    <p style="font-size:0.9em;">С наилучшими пожеланиями,<br />Fitness Workout Plan</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Fitness Workout Plan</p>
    </div>
  </div>
</div>`,
    });
  };
}
