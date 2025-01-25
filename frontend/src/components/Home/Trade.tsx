import NavbarUser from "./NavbarUser";
import axios from "axios";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";
import { userState } from "../../Store/atom";
import { HTTP_SERVER_URL } from "../../constants/const";
import EventNavbar from "./EventNavbar";
import EventComp from "./EventComp";

export const Trade = () => {
  const [user, setUser] = useRecoilState(userState);

  if (!user.userId) {
    return <span>Not logged in</span>;
  }

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["userBalance"],
    queryFn: async () => {
      const response = await axios.get(
        `${HTTP_SERVER_URL}/balance/inr/${user.userId}`
      );

      if (!response.data.data) {
        throw new Error("No data");
      }

      console.log("Balance response", response.data.data);

      setUser((prev) => {
        return {
          ...prev,
          balance: {
            freeBalances: response.data.data.balance / 100,
            lockedBalances: response.data.data.locked / 100,
          },
        };
      });

      return response.data.data;
    },
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  console.log(user,data);

  return (
    <>
      <NavbarUser />
      <EventNavbar />
      <EventComp />
    </>
  );
};
