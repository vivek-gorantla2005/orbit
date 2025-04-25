import React from 'react'

const page = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2 flex mt-3 p-5">
                <img
                    src="summary.avif"
                    alt="memories"
                    className="object-contain w-full max-w-lg"
                />
            </div>
            <div className='md:col-span-3 '>
                <p className='font-extrabold text-6xl text-gray-800'>Select Conversations to generate Summary</p>
                <ul>
                    <li className='mt-93'>
                        <div className='flex items-center gap-3'>
                            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white font-extrabold">
                                <p className="text-xl">V</p>
                            </div>
                            <div className='text-gray-700 font-extrabold text-xl'>
                                Vivek
                            </div>
                        </div>
                    </li>
                    <li className='mt-7'>
                        <div className='flex items-center gap-3'>
                            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white font-extrabold">
                                <p className="text-xl">M</p>
                            </div>
                            <div className='text-gray-700 font-extrabold text-xl'>
                                Mani
                            </div>
                        </div>
                    </li>
                    <li className='mt-7'>
                        <div className='flex items-center gap-3'>
                            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white font-extrabold">
                                <p className="text-xl">V</p>
                            </div>
                            <div className='text-gray-700 font-extrabold text-xl'>
                                Virat
                            </div>
                        </div>
                    </li>
                </ul>
            </div>


        </div>
    )
}

export default page