import config from "@config/config";
import request from "@config/request";

const sendCelebrations = async (
  users: any,
  event: string
): Promise<string[]> => {
  const successSendedIds = [];
  const path = "/send-email";
  await Promise.allSettled(
    users.map(async (user) => {
      let message = "";
      if (event === "birthday") {
        message = `Hi, ${user.firstName} ${user.lastName} it’s your birthday.`;
      }

      const sendMail = await request(config.EMAIL_SERVICE_URI).post(path, {
        email: user.email,
        message: message,
      });

      if (sendMail.status === 200) {
        successSendedIds.push(user._id);
      }
    })
  );

  return successSendedIds;
};

export { sendCelebrations };
