import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { FaUpload, FaTrash} from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { storage } from '../config/firebase.config';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { adminIds, initialTags } from '../utils/helpers';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplates from '../hooks/useTemplates';
import { db } from '../config/firebase.config';
import useUser from '../hooks/useUser';
import {useNavigate} from 'react-router-dom';

const CreateTemplate = () => {

  const [formData, setFormData] = useState({
    title: "",
    imageURL: null
  }); 

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const {
    data: templates, 
    isLoading: templatesIsLoading, 
    isError:templatesIsError, 
    refetch: templatesRefetch 
  } = useTemplates();

  const {data: user, isLoading} = useUser();

  //handling form input field change

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({
      ...prevRec, 
      [name] : value}));
  }

  //handle  file selected
  const handleFileSelect = async (e) => {
    setImageAsset((prevAsset)=>({
      ...prevAsset, 
      isImageLoading: true}));

    const file = e.target.files[0];
    console.log(file);

    if(file && isAllowed(file)){
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const loadingProgress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
          setImageAsset((prevAsset) => ({...prevAsset, progress:loadingProgress}));

          switch(snapshot.state){
            case 'paused':
              break;
            case 'running':
              break;
            default: break;
          }
        },
        (error) => {
          if(error.message.includes("storage/authorization")){
            toast.error("Error : storage authorization revoked");
          }else{
            toast.error(`Error : ${error.message}`)
          }
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageAsset((prevAsset) => ({
              ...prevAsset, 
              uri:downloadUrl}));
          });
          toast.success("Image uploaded successfully");
          setInterval(() => {
            setImageAsset((prevAsset) => ({
              ...prevAsset, 
              isImageLoading:false}));
          }, 2000);
        }
        );
    }else{
      toast.info("Invalid file format");
    }
  }

//delete am image object
  const deleteImageObject = async () => {

  const deleteRef = ref(storage, imageAsset.uri);
  setInterval(() => {
    setImageAsset( (prevAsset) => ({
      ...prevAsset,
      progress : 0,
      isImageLoading : false,
      uri : null

    }))
  }, 2000);

  deleteObject(deleteRef).then(() => {
    toast.success("Image was deleted successfully");
  });
}

  const isAllowed = (file) => {
    const allowedTypes = [ "image/jpg", "image/jpeg", "image/png" ];
    return allowedTypes.includes(file.type);

  }

  //handle seleceted Tags

  const handleSeletedTags = (tag) => {
    if(selectedTags.includes(tag)){
      //return a new array that excludes the tag and updated the tags state
      const newTagsArr = selectedTags.filter((selected) => selected !== tag);
      setSelectedTags(newTagsArr);
    }else{
      //add the tag to the array
      setSelectedTags([...selectedTags, tag]);
    }
  }

  //save information to database

  const pushToCloud = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;

    const _doc = {
      _id : id,
      title : formData.title,
      imageUrl : imageAsset.uri,
      tags: selectedTags,
      name : (templates && templates.length > 0) ? (`Template${templates.length + 1}`):("Template1"),
      timeStamp : timeStamp
    };

    await setDoc(
      doc(db, "templates", id),
      _doc
      ).then(() => {
      setFormData((prevData) => ({
        ...prevData, 
        title: "",
        imageURL: ""
      }));

      setImageAsset((prevImageRec) => ({
        ...prevImageRec,
        uri : null,
        progress : 0
      }));

      setSelectedTags([]);

      templatesRefetch();
      toast.success("Data saved successfully");
    }).catch(error => {
      toast.error(`Error : ${error.message}`);
    })
  }

  //delete template and image ref 
  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageUrl);
    await deleteObject(deleteRef).then(async ()=>{
      await deleteDoc(doc(db, "templates", template?._id)).then(()=>{
        toast.success("Template deleted successfully");
        templatesRefetch();
      }).catch((error) => {
        toast.error("There was error deleting template");
      })
    })
  }

  //secure the create template page by denyhing users from directly accessing the page in the url without loging in as adcmin
  const navigate = useNavigate();

  useEffect(
    () => {
      if(!isLoading && !adminIds.includes(user?.uid)){
        navigate("/", {replace: true});
      }
    }, 
    [user, isLoading]);


  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12 create-template">

      {/*Left Container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 w-full px-2">

        <div className="w-full mt-3">
          <p className="text-lg font-semibold uppercase">Create Template  </p>
        </div>

        {/*Template ID section */}
        <div className="w-full flex flex-1 items-center justify-start mt-3">

          <p className="uppercase text-base font-semibold">Template Id : {" "} </p>

          <p className="text-base capitalize font-bold">
            {
              templates && templates.length > 0 ? (
                `Template${templates.length + 1}`
              ):(
                "Template1"
              )
            }
          </p>
        </div>

        {/*Template Title Section */}

        <input 
          type="text" 
          placeholder="Form Title" 
          name="title"
          value={formData.title} 
          onChange={handleInputChange}
          className="w-full rounded-md bg-gray-200 px-4 py-2 border border-gray-200 focus-within:text-black outline-none mt-3"
        />

        { /*File uploader section */}

        <div className="w-full bg-gray-200 backdrop-blur-md h-[400px] lg:h-[520px] 2xl:h-[640px] rounded-md border-2 outline-none border-none cursor-pointer flex items-center justify-center mt-3">

          {
            imageAsset.isImageLoading ? (
            <>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color="blue" size={40}/>
                <p>{ imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </>):(
            <>
              {
                !imageAsset?.uri ? (
                <>
                  <label className="w-full h-full cursor-pointer">
                    <div className='flex flex-1 flex-col items-center justify-center h-full w-full'>
                      <div className='flex flex-col items-center justify-center cursor-pointer'>
                        <FaUpload/>
                        <p className='text-txtLight text-lg'>Click to upload</p>
                      </div>
                    </div>

                    <input 
                      type="file" 
                      className='h-0 w-0'
                      accept='.jpeg,.jpg,.png'
                      onChange={handleFileSelect}
                      
                    />

                  </label>
                </>):(
                <>
                  <div className='w-full h-full relative overflow-hidden rounded-md'>
                    <img 
                      src={imageAsset.uri} 
                      alt="" className='w-full h-full object-contain'
                      loading='lazy'/>

                    <div 
                      className='w-8 h-8 right-4 top-4 absolute rounded-md flex items-center justify-center bg-red-500 cursor-pointer'
                      onClick={deleteImageObject}
                    >
                      <FaTrash className='text-sm text-white'/>
                    </div>
                  </div>
                </>
                )
              }
            </>)
          }
        </div>
        {/* Tags */}
        <div className='w-full flex flex-wrap items-center gap-2 mt-3'>
          {
          initialTags.map((tag, index) => (
            <div 
              key={index}
              className={`border border-gray-300 rounded-md cursor-pointer px-2 py-1 ${selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""}`}
              onClick={() => handleSeletedTags(tag)}>
              <p className ="text-xs">{tag}</p>
            </div>
          ))
          }

        </div>

        {/* Button for saving information ton the databse */}

        <button 
          className='w-full py-3 bg-blue-700 rounded-md text-white mt-3'
          onClick={pushToCloud}>
          Save
        </button>

      </div>

      {/*Right Container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 w-full px-2 py-4  flex-1">
        {
          templatesIsLoading ? 
          (
            <>
              <div
                className='w-full h-full items-center justify-center flex'>
                <PuffLoader color="blue" size={40}/>
              </div>
            </>):(
            <>
              {
                templates && templates.length > 0 ? 
                (
                  <>
                    <div
                      className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-3'>
                    {
                      templates?.map((template) => (
                      <div
                        key={template._id}
                        className='relative rounded-md overflow-hidden w-full h-[500px]'
                        >

                        <img 
                          src={template.imageUrl} 
                          alt="" 
                          className='w-full h-full object-cover'
                          loading='lazy'
                        />

                      <div 
                        className='w-8 h-8 right-4 top-4 absolute rounded-md flex items-center justify-center bg-red-500 cursor-pointer'
                        onClick={()=> removeTemplate(template)}
                      >
                      <FaTrash className='text-sm text-white'/>
                    </div>

                      </div>
                    ))
                  }
                    </div>
                  </>
                ):(
                  <>
                    <div
                      className='w-full h-full flex flex-1 flex-col items-center justify-center gap-6'>
                        <h3 className='font-semibold text-2xl'>No templates...</h3>
                        
                    </div>
                  </>
                )
              }
            </>
          )
        }
      </div>

    </div>
  )
}

export default CreateTemplate;
