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
                <li>about us</li>
                <li>testimonials</li>
                <li>faq</li>
                <li>contact us</li>
              </ul>
            </div>
          </div>

          <div className="w-48">
                            Contact Information:
            <div>
              <ul>
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
                <li>insta</li>
                <li>facebook</li>
                <li>twitter</li>
                <li>linkedin</li>
              </ul>
            </div>
          </div>

          <div className="w-48">
                            Additional Information:
            <div>
              <ul>
                <li>terms of service</li>
                <li>privacy policy</li>
                <li>refund policy</li>
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
