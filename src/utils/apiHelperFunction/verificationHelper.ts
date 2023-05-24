import EmailVerification from "@/models/EmailVerification";
import PasswordReset from "@/models/PasswordReset";
import Student from "@/models/Student";
import Tutor from "@/models/Tutor";

export const verifyEmailToken = async (token: string) => {
  const result = await EmailVerification.findOne({token: token});

  if (!result) {
    return {error: "Invalid or expired token"};
  }

  let user;

  switch (result.role) {
    case "student":
      user = await Student.findOne({email: result.email});
      break;

    case "tutor":
      user = await Tutor.findOne({email: result.email});
      break;
  }

  if (!user) {
    await EmailVerification.findByIdAndDelete(result._id);
    return {error: "User with this email does not have an account"};
  }

  user.emailVerified = true;
  await EmailVerification.findByIdAndDelete(result._id);

  await user.save();

  return {success: true};
};

export const verifyPasswordResetToken = async (token: string) => {
  const passwordResetRecord = await PasswordReset.findOne({token: token});

  if (!passwordResetRecord) {
    return {error: "No token"};
  }

  const expirationTime = new Date(passwordResetRecord.expiresAt);

  if (expirationTime.getTime() < new Date().getTime()) {
    return {error: "Invalid or expired token"};
  }

  passwordResetRecord.allowed = true;
  await passwordResetRecord.save();

  return {
    success: true,
    email: passwordResetRecord.email,
  };
};
