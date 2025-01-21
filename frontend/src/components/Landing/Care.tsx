const careData = [
  {
    id: 1,
    icon: "./news.avif",
    title: "Fastest news feed in the game",
    description:
      "Probo is all about understanding the world around us and benefiting from our knowledge. Everything on Probo is based on real events that you can learn about, verify, and follow yourself.",
  },
  {
    id: 2,
    icon: "./tra.avif",
    title: "All the news without the noise",
    description:
      "Our experts go through tons of information to get to the very core of a world event. They help you develop not only an opinion about events but also a better understanding of the world around us.",
  },
  {
    id: 3,
    icon: "./tra2.avif",
    title: "The power to exit trades, anytime",
    description:
      "Probo is an opinion trading platform. And, like a true trading platform, Probo gives you the power to exit. You can withdraw from a trade, if it’s not going in the direction you thought it would go.",
  },
  {
    id: 4,  
    icon: "./tra3.avif",
    title: "The pulse of society is on Probo",
    description:
      "Besides helping you learn important financial & trading skills, Probo also helps you understand the collective thoughts of Indians. Knowledge that is crucial for the betterment of our country.",
  },
];
export const Care = () => {
  return (
    <div className="p-4 pt-10 flex flex-col gap-10">
      <div className="text-5xl font-bold text-left">
        Probo takes care of you, <br />
        so you take care of your trades.
      </div>

      <div className="grid grid-cols-4 gap-4">
        {careData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between gap-8 text-left"
          >
            <div>
              <img src={item.icon} alt={item.title} height={80} width={80} />
            </div>
            <div className="flex flex-col justify-evenly gap-2 items-start">
              <div className="text-2xl ">{item.title}</div>
              <div>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
