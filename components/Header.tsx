import Link from "next/link";

function Header() {
  return <header className="flex items-center justify-between p-5 ">
    {/* Left */}
    <div className="flex items-center space-x-4">
      <Link
      href="/"

      >
        <img className="object-contain cursor-pointer w-44" src="https://links.papareact.com/yvf" alt="" />
      </Link>
      <div className="hidden sm:flex items-center space-x-3"> 
        <p>About</p>
        <p>Contact</p>
        <p className="bg-green-600 cursor-pointer text-white px-4 rounded-full py-1">Follow</p>
      </div>
    </div>
    {/* Right */}
    <div>
  <div className="flex text-green-600  items-center space-x-3">
    <p>Sign In</p>
    <p className="border-green-600  border px-4 py-1 rounded-full cursor-pointer">Get Started</p>
  </div>
    </div>
  </header>;
}

export default Header;
