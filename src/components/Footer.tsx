import Link from "next/link";

/**
 * Footer at the bottom of all content pages
 * @return {JSX}
 */
export default function Footer() {
  return (
    <>
      <footer className="w-full flex flex-col bg-blue-900 text-white mt-20 rounded-t-xl">
        <div className="px-4 md:px-8 lg:px-10 lg:p-5 flex flex-wrap justify-center gap-x-20 gap-y-8 pt-4">
          <div className="w-48">
                            Navigation:
            <div>
              <ul>
                <li><Link href={"/about"}>About Us</Link></li>
                <li><Link href={"/support"}>Support Us</Link></li>
                <li><Link href={"/feed"}>Feed</Link></li>
                <li><a href={`${process.env.PAYMENT_LINK}`}>Donate</a></li>
              </ul>
            </div>
          </div>

          <div className="w-48">
                            Contact Information:
            <div>
              <ul>
                {/** TODO: Add contact info */}
                <li>email</li>
                <li>phone</li>
                <li>address</li>
              </ul>
            </div>
          </div>

          <div className="w-48">
                            Social Media Links:
            <div>
              <ul>
                {/** TODO: Add social media links */}
                <li><a href="example.com">Instagram</a></li>
                <li><a href="">Facebook</a></li>
                <li><a href="">Twitter</a></li>
                <li><a href="">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="w-48">
                            Additional Information:
            <div>
              <ul>
                {/** TODO: Add policies */}
                <li><Link target="_blank" href="/docs/terms-of-service">Terms of Service</Link></li>
                <li><Link target="_blank" href="/docs/privacy-policy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-5">
          <hr className="w-4/5 py-1" />
          <div>
                            Copyright @ TCorvus | All Rights Reserved
          </div>
        </div>
      </footer>
    </>
  );
}
