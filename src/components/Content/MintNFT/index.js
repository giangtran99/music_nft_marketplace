import { useState, useContext, useEffect } from 'react';
import web3 from '../../../connection/web3'
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import { request } from '../../../helpers/utils'
import { toast } from 'react-toastify';
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const audioTail = ["mp3", "mp4"]
const imageTail = ["jpg", "png", "jpeg"]
const MintForm = () => {
  const [enteredName, setEnteredName] = useState('');
  const [enteredGenre, setEnteredGenree] = useState('');
  const [descriptionIsValid, setDescriptionIsValid] = useState(true);
  const [enteredDescription, setEnteredDescription] = useState('');
  const [nameIsValid, setNameIsValid] = useState(true);
  const [capturedFileBuffer, setCapturedFileBuffer] = useState(null);
  const [capturedFile, setCapturedFile] = useState({});
  const [listGenre, setListGenre] = useState([])
  const [capturedCoverFileBuffer, setCapturedCoverFileBuffer] = useState(null);
  const [capturedCoverFile, setCapturedCoverFile] = useState({});

  const [fileIsValid, setFileIsValid] = useState(true);
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);

  useEffect(() => {
    request("/api/genre/index", {}, {}, "GET")
      .then(response => {
        console.log("@@thuoc", response)
        setListGenre(response)
        setEnteredGenree(response[0].id)
      })
  }, [])

  const enteredNameHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const enteredDescriptionHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  const enteredGenreHandler = (event) => {
    setEnteredGenree(+event.target.value);
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

  const captureCoverFile = (event) => {
    event.preventDefault();
    let result = {}
    const file = event.target.files[0];
    var src = URL.createObjectURL(file);
    result.source = src
    let tail = file.name.split(".")[file.name.split(".").length - 1]
    let typeFile = getTypeFile(tail)
    if (!typeFile || typeFile === "audio") {
      toast.error("Cover photo only allow for .jpg,.png ,...", {
        position: toast.POSITION.TOP_RIGHT
      });
      return
    }
    result.type = typeFile
    setCapturedCoverFile(result)
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setCapturedCoverFileBuffer(Buffer(reader.result));
    }
  };

  const captureFile = (event) => {
    event.preventDefault();

    let result = {}
    const file = event.target.files[0];
    var src = URL.createObjectURL(file);
    result.source = src
    let tail = file.name.split(".")[file.name.split(".").length - 1]
    let typeFile = getTypeFile(tail)
    if (!typeFile) {
      toast.error("File type invalid", {
        position: toast.POSITION.TOP_RIGHT
      });
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
      const fileCoverPhotoAdded = await ipfs.add(capturedCoverFileBuffer);
      if (!fileAdded) {
        console.error('Something went wrong when updloading the file');
        return;
      }

      const metadata = {
        title: "Asset Metadata",
        type: "object",
        properties: {
          name: {
            type: "string",
            description: enteredName
          },
          description: {
            type: "string",
            description: enteredDescription
          },
          coverPhoto: {
            type: "string",
            description: fileCoverPhotoAdded.path
          },
          metadata: {
            type: "string",
            description: fileAdded.path
          },
          minter: {
            type: "string",
            description: web3Ctx.account
          }
        }
      };

      const metadataAdded = await ipfs.add(JSON.stringify(metadata));
      if (!metadataAdded) {
        console.error('Something went wrong when updloading the file');
        return;
      }
      collectionCtx.contract.methods.safeMint(metadataAdded.path).send({ from: web3Ctx.account })
        .on('transactionHash', async (hash) => {
          const receipt = await web3.eth.getTransactionReceipt(hash)
          // console.log("@@vui buon0",web3.utils.hexToNumber(receipt.logs[0].topics[0]))
          // console.log("@@vui buon1",web3.utils.hexToNumber(receipt.logs[0].topics[1]))
          // console.log("@@vui buon2",web3.utils.hexToNumber(receipt.logs[0].topics[2]))
          if (hash) {
            const tokenId = web3.utils.hexToNumber(receipt.logs[0].topics[3])
            request('/api/transactionlog/create',{
              action:"Mint",
              from:receipt.from,
              to:receipt.to,
              ethPrice:0,
              tokenId:tokenId
            },{},'POST')
  
            const body = {
              name: enteredName,
              cid: metadataAdded.path,
              genre_id: enteredGenre,
              tokenId: tokenId,
              cover_photo:fileCoverPhotoAdded.path
            }
            toast.success("Success Mint NFT !", {
              position: toast.POSITION.TOP_RIGHT
            });
            request("/api/nft/create", body, {}, "POST")
            return
          }
          toast.error("Failed Mint NFT !", {
            position: toast.POSITION.TOP_RIGHT
          });


          collectionCtx.setNftIsLoading(true);
        })
        .on('error', (e) => {
          toast.error('Something went wrong when pushing to the blockchain');
          collectionCtx.setNftIsLoading(false);
        })
    };

    formIsValid && mintNFT();
  };

  return (
    <>
      <div className="bg-white">
        <div className="md:grid md:grid-cols-3 md:gap-6 content-center">
          <div className="mt-5 md:mt-0 md:col-span-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0 mt-10">
                <h4 className="text-3xl font-medium leading-9 text-black text-center">Create New NFT</h4>
              </div>
            </div>
            <form onSubmit={submissionHandler}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white sm:p-6">
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
                    <label htmlFor="description" className="block text-sm font-medium text-black mt-5">
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
                    <label htmlFor="genre" className="block text-sm font-medium text-black mt-5">
                      Genre
                    </label>
                    <div className="mt-1">
                      <select value={enteredGenre} onChange={enteredGenreHandler} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full h-[30px] sm:text-sm border border-gray-300 rounded-md" id="grid-state">
                        {listGenre.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                      </select>
                    </div>
                  </div>


                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-black mt-5">
                      Cover photo
                    </label>
                    <div className="flex items-center w-full">
                      <label
                        className="flex flex-col w-[300px] h-[300px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                        <div className="relative flex flex-col items-center justify-center pt-7">
                          <img src={capturedCoverFile.source} id="preview" className="absolute inset-0 w-full w-full" />
                          <svg xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd" />
                          </svg>
                          <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                            Select a photo</p>
                        </div>
                        <input onChange={captureCoverFile} type="file" className="opacity-0" accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-black mt-5">
                      Metadata
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        className="flex flex-col w-full h-[300px] border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                        <div className="relative flex flex-col items-center justify-center pt-16">
                          {capturedFile.type === "audio" ? <audio controls>
                            <source src={capturedFile.source} type="audio/ogg" />
                          </audio>
                            : <img src={capturedFile.source} id="preview" className="absolute inset-0 w-64 h-auto" />}
                          <svg xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-14 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd" />
                          </svg>
                          <p className="pt-2 text-sm tracking-wider text-gray-400 group-hover:text-indigo-400"> Select a photo or audio</p>
                        </div>
                        <input onChange={captureFile} type="file" className="opacity-0" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-white text-right sm:px-6">
                  <button
                    type="submit"
                    className="bg-indigo-500 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-xl font-medium rounded-md text-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Mint
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
    //         className={`${nameclassName} mb-1`}
    //         placeholder='Name...'
    //         value={enteredName}
    //         onChange={enteredNameHandler}
    //       />
    //     </div>
    //     <div className="col-md-6">
    //       <input
    //         type='text'
    //         className={`${descriptionclassName} mb-1`}
    //         placeholder='Description...'
    //         value={enteredDescription}
    //         onChange={enteredDescriptionHandler}
    //       />
    //     </div>
    //     <div className="col-md-2">
    //       <input
    //         type='file'
    //         className={`${fileclassName} mb-1`}
    //         onChange={captureFile}
    //       />
    //     </div>
    //   </div>
    //   <button type='submit' className='btn btn-lg btn-info text-black btn-block'>MINT</button>
    // </form>
  );
};

export default MintForm;