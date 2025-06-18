import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const ChatPage = () => {
  const {user, suggestedUsers} = useSelector(store => store.auth)
  return (
    <div className='flex ml-auto'>
      <section>
        <h1>{user?.username}</h1>
        <hr className='mb-4 border-gray-300'/>
        <div className='overflow-y-auto h-[80vh]'>
          {
suggestedUsers.map((suggestedUser)=>{
  return(
    <div>
      <Avatar>
        <AvatarImage src={suggestedUser?.profilePicture}/>
        <AvatarFallback className='bg-gray-300'>U</AvatarFallback>
      </Avatar>
      <div>
        <span>{suggestedUser?.username}</span>
      </div>
    </div>
  )
})
          }
        </div>
      </section>
    </div>
  )
}

export default ChatPage