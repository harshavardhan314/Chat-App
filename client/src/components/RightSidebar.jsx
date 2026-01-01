import React from 'react'
import assets from '../assets/assets'
const RightSidebar = ({selectedUser}) => {
  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ?"max-md:hidden":"" }`}>
        <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img src={selectedUser.profilePic || assets.avatar_icon} alt=" profile-pic" className='w-20 aspect-[1/1] rounded-full mt-5 ml-5' />
          <h1 className='px-10 text-xl font-medium flex items-center gap-2 mx-auto' >
            
            <p className="w-2 h-2 rounded-full bg-green-500"></p>
             {selectedUser.fullName}
            </h1>
            <p  >{selectedUser.bio}</p>
        </div>
        
      
    </div>
  )
}

export default RightSidebar
