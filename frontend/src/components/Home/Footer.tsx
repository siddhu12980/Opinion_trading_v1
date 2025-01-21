import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

const Footer = () => {
  return (
    <div className="mt-10">
      <div className="flex justify-between w-full border-slate-200 border-b-2 pb-3">
        <div className="flex justify-between space-x-8">
          <img src="./logo.avif" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 pb-4 ">
        {/* Company Column */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Company</h2>
          <ul>
            <li>About Us</li>
            <li>Culture</li>
            <li>Careers</li>
            <li>Open Roles</li>
          </ul>
        </div>

        {/* Resources Column */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Resources</h2>
          <ul>
            <li>What's New</li>
            <li>Help Centre</li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Support</h2>
          <ul>
            <li>Contact Support</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Contact</h2>
          <ul>
            <li>Email Us:</li>
            <li>help@probo.in</li>
            <li>communication@probo.in</li>
          </ul>
        </div>

      </div>



      <div className="flex  justify-between p-4 gap-2 border-t-2 border-slate-200">
        <div className="flex flex-col w-[60%] text-left gap-4">
          <div className="text-2xl">Probo Partnerships</div>
          <div>Probo’s experience is made possible by our partnerships with TradingView (track upcoming events with Economic Calendar or browse stocks in the Screener), Authbridge for verification technology, DataMuni for data & analytics, Google Firebase, Google Cloud & AWS. Probo is also a member of FICCI and ASSOCHAM.</div>
        </div>


        <div className="flex flex-row space-x-4 w-[40%] justify-evenly items-center" >
          <div>
            <img src="./trade.jpeg" alt="TradingView logo" />
          </div>
          <div>
            <img src="./auth.jpeg" alt="Authbridge logo" />
          </div>
          <div>
            <img src="./fire.jpeg" alt="Google Firebase logo" />
          </div>
          <div>
            <img src="./google.jpeg" alt="Google Cloud logo" />
          </div>
        </div>

      </div>


      <div className="flex  justify-center gap-8 items-center p-10 ">

        <div> <FaXTwitter size={32} /></div>

        <div> <FaInstagram size={32} /></div>

        <div> <FaYoutube size={32} /></div>

        <div> <FaLinkedin size={32} /></div>


      </div>

      <div className="flex justify-between items-center py-4 border-t border-gray-700">
        <div className="flex space-x-4">
          <a href="/terms" className="hover:underline">Terms and Conditions</a>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
        </div>
        <div>
          © copyright 2024 by Probo Media Technologies Pvt. Ltd.
        </div>
      </div>

    </div>
  )
}

export default Footer
