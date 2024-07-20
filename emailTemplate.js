const emailTemplate = () => ({
  subject: 'CSRF Attack: Demo',
  content: `
  <!DOCTYPE HTML>
<html>

<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    .button {
      width: 240px;
      height: 40px;
      background-color : #DFD0B8 !important;
      color: black !important;
      border: 0;
      border-radius: 5px;
      text-align: center;
      line-height: 40px;
      display: inline-block;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div style="width: 640px;">
    <table>
      <tr>
        <td style="height: 70px;vertical-align: center; padding: 10px 0;">
          <div style="width: 320px; display: table-cell;">
          </div>
        </td>
      </tr>
      <tr style="text-align: center;background-color: #FCF6F5; border-spacing: 0;">
        <td style="padding: 60px 56px;">
          <div>
            <div style="background: #fff; padding: 20px 24px;">
              <p style="padding: 0 0 14px;text-align: left; color: #000000;"><b>Hello,</b></p>
              <p style="padding: 0 0 60px; color: #666666; text-align: left;">Click the button/link below to see the payment receipt!</p>
              <div style="padding: 0 0 40px;">
                <a href="http://localhost:3000/perform-action" class="button"><b>Receipt</b></a>
              </div>
              <p style="padding: 0 0 5px;text-align: left; margin: 0; color: #000000;">Thank you</p>
            </div>
          </div>
        </td>
      </tr>
      <tr style="width: 640px; background: #DFD0B8; display: table; border-spacing: 0;">
        <td style="width: 640px; padding:0;">
          <div style="text-align: center; vertical-align: bottom; align-items: center;
          display: grid;
          justify-content: center;">
            <div style="display: flex; align-items:center; justify-content: center; padding: 20px 170px 0;">
              <div style="display: table-cell; padding: 0; margin: 0 30px 0 90px;">
              </div>
              <div style="display: table-cell; width: 40px;">
              </div>
              <div style="
                  display: none;
                  width: 40px;
                ">
              </div>
              <div style="display: none; width: 40px; padding: 0">
              </div>
            </div>
            <div style="padding: 30px 0;">
              <div
                style="width: 319px;text-align: right; padding: 0 20px 0 0;color: white; font-size: 14px; display: table-cell;">
              </div>
              <div style="width: 0px;height: 22px;border-left: 1px solid white;padding: 0; display: table-cell;"></div>
              <div
                style="width: 320px;text-align: left; padding: 0 0 0 20px;color: white;  font-size: 14px; display: table-cell;">
              </div>
            </div>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>
  `,
});

module.exports = emailTemplate;
