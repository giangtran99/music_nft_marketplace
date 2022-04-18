import { useState, useContext } from 'react';

import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import {request} from '../../../helpers/utils'
import { toast } from 'react-toastify';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const audioTail = ["mp3", "mp4"]
const imageTail = ["jpg", "png","jpeg"]
const CreateAlbumForm = () => {
  const [enteredName, setEnteredName] = useState('');
  const [descriptionIsValid, setDescriptionIsValid] = useState(true);
  const [enteredDescription, setEnteredDescription] = useState('');
  const [nameIsValid, setNameIsValid] = useState(true);
  const [capturedFileBuffer, setCapturedFileBuffer] = useState(null);
  const [capturedFile, setCapturedFile] = useState({});
  const [fileIsValid, setFileIsValid] = useState(true);
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);

  
  const enteredNameHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const enteredDescriptionHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  const getTypeFile = (fileTail) => {
    if (audioTail.includes(fileTail)) {
      return "audio"
    } else if (imageTail.includes(fileTail)) {
      return "image"
    } else {
      return null
    }
  }
  const captureFile = (event) => {
    event.preventDefault();

    let result = {}
    const file = event.target.files[0];
    var src = URL.createObjectURL(file);
    result.source = src
    let tail = file.name.split(".")[file.name.split(".").length - 1]
    let typeFile = getTypeFile(tail)
    if (!typeFile) {
      return
    }
    result.type = typeFile
    setCapturedFile(result)
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setCapturedFileBuffer(Buffer(reader.result));
    }
  };

  const submissionHandler = (event) => {
    event.preventDefault();
    enteredName ? setNameIsValid(true) : setNameIsValid(false);
    enteredDescription ? setDescriptionIsValid(true) : setDescriptionIsValid(false);
    capturedFileBuffer ? setFileIsValid(true) : setFileIsValid(false);
    console.log("@@enteredName", enteredName)
    const formIsValid = enteredName && enteredDescription && capturedFileBuffer;

    // Upload file to IPFS and push to the blockchain
    const mintNFT = async () => {
      // Add file to the IPFS
      const fileAdded = await ipfs.add(capturedFileBuffer);
      if (!fileAdded) {
        console.error('Something went wrong when updloading the file');
        return;
      }

      const body = {
        name: enteredName,
        description:enteredDescription,
        album_picture: fileAdded.path
      };

      request("/api/album/create",body,{},"POST")
      .then(response=>{
        if(response.id){
          toast.success("Success Create Album !", {
            position: toast.POSITION.TOP_RIGHT
          });
          return
        }
        toast.error("Fail Create Album !", {
          position: toast.POSITION.TOP_RIGHT
        });
        return
      })
    };

    formIsValid && mintNFT();
  };

  const nameClass = nameIsValid ? "form-control" : "form-control is-invalid";
  const descriptionClass = descriptionIsValid ? "form-control" : "form-control is-invalid";
  const fileClass = fileIsValid ? "form-control" : "form-control is-invalid";

  console.log("@@capturedFile", capturedFile)
  return (
    <>
      <div className="bg-white">
        <div className="md:grid md:grid-cols-3 md:gap-6 content-center">
          <div className="mt-5 md:mt-0 md:col-span-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0 mt-10">
                <h4 className="text-3xl font-medium leading-9 text-black text-center">Create New Album</h4>
              </div>
            </div>
            <form onSubmit={submissionHandler}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-12 sm:p-6">
                  <div>
                    <div className="col-span-3 sm:col-span-2">
                      <label htmlFor="about" className="block text-sm font-medium text-black">
                        Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <textarea
                          value={enteredName}
                          onChange={enteredNameHandler}
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="NFT name..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-black">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="description..."
                        value={enteredDescription}
                        onChange={enteredDescriptionHandler}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-black">
                      Cover photo
                    </label>
                    <div class="flex items-center w-full">
                      <label
                        class="flex flex-col w-[300px] h-[300px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                        <div class="relative flex flex-col items-center justify-center pt-7">
                        <img src={capturedFile.source} id="preview" class="absolute inset-0 w-full w-full" />
                          <svg xmlns="http://www.w3.org/2000/svg"
                            class="w-12 h-12 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd" />
                          </svg>
                          <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                            Select a photo</p>
                        </div>
                        <input onChange={captureFile} type="file" class="opacity-0" accept="image/*" />
                      </label>

                    </div>
                  </div>

                  {/* <div>
                    <label htmlFor="about" className="block text-sm font-medium text-black">
                      Metadata
                    </label>
                    <div class="flex items-center justify-center w-full">
                      <label
                        class="flex flex-col w-full h-[300px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                        <div class="relative flex flex-col items-center justify-center pt-16">
                          {capturedFile.type === "audio" ? <audio controls>
                            <source src={capturedFile.source} type="audio/ogg" />
                          </audio>
                            : <img src={capturedFile.source} id="preview" class="absolute inset-0 w-64 h-auto" />}
                          <svg xmlns="http://www.w3.org/2000/svg"
                            class="w-12 h-14 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd" />
                          </svg>
                          <p class="pt-2 text-sm tracking-wider text-gray-400 group-hover:text-indigo-400"> Select a photo or audio</p>
                        </div>
                        <input onChange={captureFile} type="file" class="opacity-0" />
                      </label>
                    </div>
                  </div> */}
                </div>
                <div className="px-4 py-3 bg-white text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xl font-medium rounded-md text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
    // <form onSubmit={submissionHandler}>
    //   <div className="row justify-content-center">
    //     <div className="col-md-2">
    //       <input
    //         type='text'
    //         className={`${nameClass} mb-1`}
    //         placeholder='Name...'
    //         value={enteredName}
    //         onChange={enteredNameHandler}
    //       />
    //     </div>
    //     <div className="col-md-6">
    //       <input
    //         type='text'
    //         className={`${descriptionClass} mb-1`}
    //         placeholder='Description...'
    //         value={enteredDescription}
    //         onChange={enteredDescriptionHandler}
    //       />
    //     </div>
    //     <div className="col-md-2">
    //       <input
    //         type='file'
    //         className={`${fileClass} mb-1`}
    //         onChange={captureFile}
    //       />
    //     </div>
    //   </div>
    //   <button type='submit' className='btn btn-lg btn-info text-black btn-block'>MINT</button>
    // </form>
  );
};

export default CreateAlbumForm;