
import axios from 'axios';
import Comment from './Comment.jsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loader from './Loader.jsx';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';

const fetchComment = async (postId) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
    return res.data;
}

const Comments = ({ postId }) => {

    const { getToken } = useAuth();

    const { isPending, error, data } = useQuery({
        queryKey: ["comment", postId],
        queryFn: () => fetchComment(postId)
    })

    
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async (newComments) => {
            const token = await getToken();
            return await axios.post(`${import.meta.env.VITE_API_URL}/comments/${postId}`, newComments, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comment", postId] })
        },
        onError: (error) =>{
            toast.error(error.response.data)
        }
    })
    
    const handelSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const data = {
            desc: formData.get("desc"),
        }
        
        mutation.mutate(data)
        e.target.reset();
    }
    if (isPending) return <Loader />
    if (error) return "Something went wromg" + error.message
    if (!data) return "NO Comments Yet"
    
    return (
        <div className='flex flex-col gap-8 lg:w-3/5 mb-4'>
            <h1 className='text-xl text-gray-500 underline'>Comments</h1>
            <form onSubmit={handelSubmit} className='flex items-center justify-between gap-8 w-full '>
                <textarea name='desc' placeholder='Write a comment...' className='w-full rounded-xl p-4 bg-white' />
                <button className='bg-blue-800 px-4 py-2.5 font-medium text-white rounded-xl cursor-pointer'>Send</button>
            </form>
            {data.map((comment) =>
                <Comment key={comment._id} Comment={comment} postId={postId}/>
            )}
        </div>
    )
}

export default Comments
