/**
 * footer
 * @return {JSX}
 */
export default function Footer() {
  return (
    <>
      <footer className="w-full flex justify-center bg-blue-900 text-white p-5 mt-20 rounded-t-xl">
        <div className="w-4/5 px-8 flex-col justify-center">
          <div className="w-full pb-5 px-10 flex justify-between">
            <div className="w-fit">
                            Navigation:
              <div>
                <ul>
                  <li>about us</li>
                  <li>how it works</li>
                  <li>testimonials</li>
                  <li>faq</li>
                  <li>contact us</li>
                </ul>
              </div>
            </div>

            <div className="w-fit">
                            Contact Information:
              <div>
                <ul>
                  <li>email</li>
                  <li>phone</li>
                  <li>address</li>
                </ul>
              </div>
            </div>

            <div className="w-fit">
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

            <div className="w-fit">
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

          <div>
            <hr />
            <div>
                            Copyright @ TCorvus | All Rights Reserved
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
