import {EmailIcon, PhoneIcon} from "@/utils/icons";

const ContactDetails = ({email, phoneNumber}: {email: string, phoneNumber: string}) => {
  return (
    <div>
      <h2 className="text-xl font-medium pb-2">Contact Details</h2>
      <div className="flex items-center gap-2">
        <EmailIcon color="#F97316" size={25} />
        <p className="m-0 text-base">{email}</p>
      </div>
      <div className="flex items-center gap-2">
        <PhoneIcon color="#F97316" size={25} />
        <p className="m-0 text-base">{phoneNumber}</p>
      </div>
    </div>
  );
};

export default ContactDetails;
