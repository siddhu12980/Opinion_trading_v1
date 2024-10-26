
const SlideCard = () => {
  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow ">

      <a href="#">
        <img className="p-4 rounded-t-lg" src="./f1.png" alt="product image" height={150} width={150} />
      </a>
      <div className="text-sm">
        3127 orders
      </div>
      <div className="px-2 pb-4">
        <a href="#">
          <h5 className="text-xs font-semibold tracking-tight text-gray-900 ">Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport</h5>
        </a>

        <div className="flex items-center  gap-2 justify-between">
          <a href="#" className="text-blue-900 bg-blue-300  font-medium rounded-lg text-sm px-6 py-2 text-center ">Yes</a>
          <a href="#" className="text-red-700 bg-red-300 font-medium rounded-lg text-sm px-6 py-2 text-center ">No</a>
        </div>
      </div>
    </div>
  )
}



export default SlideCard



