import Link from "next/link";

/**
 * Footer at the bottom of all content pages
 * @return {JSX}
 */
export default function Footer() {
  return (
    <footer className="w-full flex flex-col bg-blue-900 text-white px-4 md:px-8 lg:px-20">
      <div className="lg:py-5 grid grid-cols-2 lg:grid-cols-4 jusify-center lg:gap-x-20 gap-y-8 pt-4">
        <div className="space-y-4">
          <p className="text-white text-lg font-medium">Navigation</p>
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
          <p className="text-white text-lg font-medium">Contact Information</p>
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
          <p className="text-white text-lg font-medium">Find us here</p>
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
          <p className="text-white text-lg font-medium">Additional information</p>
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
        <hr className="w-full py-1" />
        <div className="text-sm">
                            Copyright @ TCorvus | All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
