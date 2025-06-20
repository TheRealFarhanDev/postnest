
import { useAuth, useUser } from '@clerk/clerk-react'
import Image from './Image'
import { formatDistanceToNow } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import axios from 'axios'

const Comment = ({ Comment, postId }) => {
    const {user} = useUser()
    const role = user?.publicMetadata?.role
    const {getToken} = useAuth()

    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${Comment._id}`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["comment", postId] })
          toast.success("Comment deleted successfully!") 
        },
        onError: (error) =>{
            toast.error(error.response.data)
        }
    })
  
  return (
    <div className='flex flex-col gap-4 bg-slate-50 rounded-xl p-4'>
      <div className='flex gap-4 items-center'>
        <Image src={Comment.user.img} className='rounded-full object-cover w-10 h-10' w={40} h={40} />
        <span className='font-medium'>{Comment.user.username}</span>
        <span className='text-gray-500 text-sm'>{formatDistanceToNow(Comment.createdAt)}</span>
        {user && (Comment.user.username === user.username || role === "admin")&& (
          <span className='text-xs text-red-300 hover:text-red-500 cursor-pointer' onClick={()=>mutation.mutate()}>
            delete
            {mutation.isPending && <span>(in progress)</span>}
            </span>
        )}
      </div>
      <p className='text-justify'>{Comment.desc}</p>
    </div>
  )
}

export default Comment
