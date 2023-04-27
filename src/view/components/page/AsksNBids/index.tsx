import { ListOfCourses } from "../../common/ListOfCourses"
import { useAsksNBidsProvided, withAsksNBidsProvider } from "./provider"

export const AsksNBidsPage = withAsksNBidsProvider(() => {
  const { asks, bids } = useAsksNBidsProvided()
  return <div className="w-screen h-screen">
    <div className="w-[min-content] p-4 flex justify-center items-center">
      <div className="w-1/2 min-w-[280px] pr-2">
        <h3 className="text-lg mb-4 text-center">Asks</h3>
        { asks ? <ListOfCourses list={asks}/> : 'Loading...' }
      </div>
      <div className="w-1/2 min-w-[280px] pl-2">
        <h3 className="text-lg mb-4 text-center">Bids</h3>
        { bids ? <ListOfCourses list={bids}/> : 'Loading...' }
      </div>
    </div>
  </div>
})
