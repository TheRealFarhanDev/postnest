import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react'
import Loader from "../components/Loader.jsx"
import 'react-quill-new/dist/quill.snow.css';
import ReactQuill from "react-quill-new"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { toast } from 'react-toastify';
import Upload from '../components/Upload.jsx';
import { Progress } from "../components/ui/progress.jsx"
import Image from '../components/Image.jsx';



const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [value, setValue] = useState("")
  const [category, setCategory] = useState("General")
  const [coverImage, setCoverImage] = useState(null);
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);

  const quillRef = useRef(null)

  const navigate = useNavigate();

  useEffect(() => {
    if (img?.url && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      const index = range ? range.index : editor.getLength();

      editor.insertEmbed(index, 'image', img.url);
      editor.insertText(index + 1, '\n'); // Insert newline after image
      editor.setSelection(index + 2); // Move cursor after newline

      setImg(null); // Clear img
    }
  }, [img]);

  useEffect(() => {
    if (video?.url && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      const index = range ? range.index : editor.getLength();

      editor.insertEmbed(index, 'video', video.url);
      editor.insertText(index + 1, '\n'); // Insert newline after video
      editor.setSelection(index + 2); // Move cursor after newline

      setVideo(null); // Clear video
    }
  }, [video]);



  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return await axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    },
    onSuccess: (res) => {
      toast.success("Post has been created!")
      navigate(`/${res.data.post.slug}`);
    }
  })

  if (!isLoaded) {
    return (<div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>);
  }

  if (isLoaded && !isSignedIn) {
    return <div>You should Login!</div>;
  }

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target)

    const data = {
      title: formData.get("title"),
      category: category,
      desc: formData.get("desc"),
      content: value,
      img: coverImage?.url || ""
    }
    mutation.mutate(data);

  }

  return (
    <div className='h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6 '>
      <h1 className='text-xl font-light'>Create a New Post</h1>
      <form onSubmit={handleSubmit} action="" className='flex flex-col gap-6 flex-1 mb-6 '>
        {/* <button className='inline bg-white p-2 rounded-xl text-gray-500 text-sm shadow-md max-w-max cursor-pointer'>Add a cover image</button> */}
        <Upload
          fileUrl={coverImage}
          setData={setCoverImage}
          fileType="image/*"
        >
          <div className="bg-white p-2 rounded-xl text-gray-500 text-sm shadow-md cursor-pointer w-fit">
            Upload Cover Image
          </div>
        </Upload>

        {coverImage && (
          <Image
            src={coverImage.filePath}
            alt="Cover Preview"
            className="max-w-xs mt-2 rounded-xl shadow object-cover"
            w={300}
            h={200}
          />
        )}

        {progress > 0 && progress < 100 && (
          <Progress value={progress} className="mb-2" />
        )}

        <input className='text-4xl font-semibold bg-transparent outline-none' type="text" placeholder='My Awesome Story' name='title' />
        <div className='flex items-center gap-4'>
          <label htmlFor="">Choose a category:</label>
          {/* <select name="cat" id="" className='p-2 rounded-xl bg-white shadow-md'>
            <option value="general">General</option>
            <option value="web-Design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select> */}
          <Select value={category} onValueChange={(val) => setCategory(val)}>
            <SelectTrigger className="w-[130px] bg-white shadow-md cursor-pointer">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="General" >General</SelectItem>
                <SelectItem value="Web-Design">Web Design</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Databases">Databases</SelectItem>
                <SelectItem value="Seo">Search Engines</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <textarea name="desc" placeholder='A Short Description' className='p-4 rounded-xl bg-white shadow-md' />
        <div className='flex flex-1 gap-2'>
          <div className='flex flex-col gap-2 mr-2 mt-2'>
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              <div className='cursor-pointer'><img src="./image.svg" alt="upload photo" /></div>
              {/* <button className="p-2 rounded bg-white shadow-md">Upload Image</button> */}
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              <div className='cursor-pointer'><img src="./video.svg" alt="upload video" /></div>
              {/* <button className="p-2 rounded bg-white shadow-md">Upload Video</button> */}
            </Upload>
          </div>
          <ReactQuill ref={quillRef} theme="snow" className='flex-1 rounded-xl bg-white shadow-md min-h-52' value={value} onChange={setValue} />
        </div>
        <button disabled={mutation.isPending} className='bg-blue-800 py-2 font-medium text-white rounded-xl cursor-pointer w-36 disabled:cursor-not-allowed disabled:bg-blue-400 mb-2' type='submit'>{mutation.isPending ? "Loading..." : "Send"}</button>



        {mutation.isError && <span>{mutation.error.message}</span>}
      </form>
    </div>
  )
}

export default Write
