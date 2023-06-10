import Link from "next/link";
import {useState} from "react";

/**
 * Footer at the bottom of all content pages
 * @return {JSX}
 */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const subscribeToNewsLetters = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/newsletters/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const json = await res.json();

        setError(json.message);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <footer className="w-full flex flex-col bg-blue-900 text-white px-4 md:px-8 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-x-20 gap-y-8 lg:py-5">
          <div className="lg:py-5 grid grid-cols-2 lg:grid-cols-4 jusify-center lg:gap-x-20 gap-y-8 pt-4">
            <div className="space-y-4">
              <p className="text-light text-lg font-medium">Navigation</p>
              <div>
                <ul className="font-light">
                  <li><Link href={"/about"}>About Us</Link></li>
                  <li><Link href={"/support"}>Support Us</Link></li>
                  <li><Link href={"/feed"}>Feed</Link></li>
                  <li><a href={`${process.env.PAYMENT_LINK}`}>Donate</a></li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-light text-lg font-medium">Contact Information</p>
              <div>
                <ul className="font-light">
                  {/** TODO: Add contact info */}
                  <li>email</li>
                  <li>phone</li>
                  <li>address</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-light text-lg font-medium">Find us here</p>
              <div>
                <ul className="font-light">
                  {/** TODO: Add social media links */}
                  <li><a href="example.com">Instagram</a></li>
                  <li><a href="">Facebook</a></li>
                  <li><a href="">Twitter</a></li>
                  <li><a href="">LinkedIn</a></li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-light text-lg font-medium">Additional information</p>
              <div>
                <ul className="font-light">
                  {/** TODO: Add policies */}
                  <li><Link target="_blank" href="/docs/terms-of-service">Terms of Service</Link></li>
                  <li><Link target="_blank" href="/docs/privacy-policy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <form className="text-center lg:text-left">
            <p className="text-light text-lg font-medium">Subsribe to our newsletters</p>
            <input
              type="email"
              placeholder="Your email"
              className="inputField placeholder:text-gray-300 mb-4"
              onSubmit={subscribeToNewsLetters}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`btn btn-sm orange border-none rounded-lg capitalize w-full
                ${loading ? "btn-disabled" : ""}`}
              disabled={loading}
            >
            Subscribe
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center py-5">
          <hr className="w-full py-1" />
          <div className="text-sm">
                            Copyright @ TCorvus | All Rights Reserved
          </div>
        </div>
      </footer>

      {open && (
        <div className={`alert ${success ? "alert-success" : "alert-error"} 
          shadow-lg fixed left-1/2 w-[90%] -translate-x-1/2 top-20`}>
          <div className="flex w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{success ? "You have been successfully subscribed to newsletters" : error}</span>
            <button type="button" onClick={() => setOpen(false)} className="ml-auto">&#10006;</button>
          </div>
        </div>
      )}
    </>
  );
}
