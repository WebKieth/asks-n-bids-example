import { StatItem, StatModel } from "../../page/AsksNBids/provider"
import { ChevronUpIcon, ChevronDownIcon, MinusIcon } from '@heroicons/react/24/solid'

type Props = {
  list: StatModel | null,
  className?: string
}

export const ListOfCourses = ({ list, className = '' }: Props) => {
  return <div className={`${className} flex flex-col w-[max-content]`}>
    {Object.keys(list).map((askKey) => {
      const ask = list[askKey]
      return <div className="flex items-center border-b border-ui-slate-200" key={askKey}>
        {ask.map(({value, delta}: StatItem) => {
          return <div className="min-w-[120px] w-1/2 px-4 py-2 flex items-center justify-between" key={value}>
            <span className="mr-2">{value}</span>
            {delta === 'asc'
              ? <ChevronUpIcon className="w-4 stroke-green-400" />
              : delta === 'desc'
                ? <ChevronDownIcon className="w-4 stroke-red-400" />
                : <MinusIcon className="w-4 stroke-red-400" />}
          </div>
        })}
      </div>
    })}
  </div>
}