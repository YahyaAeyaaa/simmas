import { ReactNode } from "react"

interface CardProps {
    title: string
    total: number
    icon: ReactNode
    subtitle: string
}

const Card = ({
    title,
    total,
    icon,
    subtitle
}: CardProps ) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className='flex items-center justify-between mb-6'> 
                <h3 className="text-gray-500 font-semibold">{title}</h3>
                {icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
            <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>
    )
}

export default Card