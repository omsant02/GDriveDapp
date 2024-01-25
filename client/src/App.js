import { useState, UseEffect, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import Display from "./components/Display";
import FileUpload from "./components/FileUpload";
import Modal from "./components/Modal";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum); //read the Blockchain
    const wallet = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner(); //write the blockchain
        const address = await signer.getAddress();
        console.log(address);
        setAccount(address);

        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(signer);
      } else {
        alert("Metamask is not installed");
      }
    };
    provider && wallet();
  }, []);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
      <div className="App">
        <h1>Gdrive 3.0</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p>Account : {account}</p>
        <FileUpload account={account} contract={contract}></FileUpload>
        <Display account={account} contract={contract}></Display>
      </div>
    </>
  );
}

export default App;
