const Tradeheader = ({ tile }: { tile: string }) => {
  return (
    <div className="flex gap-5 ">
      <div className="">
        <img
          width={200}
          height={200}
          src="https://www.pngitem.com/pimgs/m/161-1617330_tax-income-taxes-clipart-hd-png-download.png"
        />
      </div>


      <div className=" text-4xl   ">
        <h1 className="font-bold text-4xl">{tile}</h1>
      </div>
    </div>
  );
};

export default Tradeheader;
