import EventComp from "./EventComp"
import EventNavbar from "./EventNavbar"
import NavbarUser from "./NavbarUser"
import axios from "axios"
import { HTTP_SERVER_URL } from "../constants/const"
import { userBalanceSelector } from "../Store/atom"
import { useRecoilState } from "recoil"
import { useQuery, useQueryClient } from "react-query"
import { useEffect } from "react"

export const Trade = () => {
  const [balance, setBalance] = useRecoilState(userBalanceSelector)
  const queryClient = useQueryClient();

  async function get_user() {
    try {
      const response = await axios.get(`${HTTP_SERVER_URL}/balance/inr/buyer1`)
      const data = response.data.data
      return data
    } catch (e) {
      console.error(e);
    }
  }


  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['userBalance'],
    queryFn: async () => {
      const response = await axios.get(`${HTTP_SERVER_URL}/balance/inr/buyer1`);
      return response.data.data;
    },

  });


  useEffect(() => {
    if (data) {
      setBalance(data.balance / 100);
    }
  }, [data, setBalance]);




  if (isLoading) {
    return <span>Loading...</span>
  }


  if (isError) {
    return <span>Error: {(error as Error).message}</span>
  }
  
  return (
    <>
      <NavbarUser balance={balance} />
      <EventNavbar />
      <EventComp />
    </>

  )
}

