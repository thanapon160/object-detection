import nvision from "@nipacloud/nvision/dist/browser/nvision"
import { useState } from "react";

require('dotenv').config();

function App() {
  const [data, setData] = useState([])
  const objectDetectionService = nvision.objectDetection({
    apiKey: process.env.REACT_APP_API_KEY
  });

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const handleUpload = async (e) => {
    const res = await toBase64(e.target.files[0])
    const imageBase64 = res.split(',')[1]
    await objectDetectionService.predict({
      rawData: imageBase64,
      outputCroppedImage: true,
      outputVisualizedImage: true,
    }).then((result) => {
      setData([result])
    });
  }
  console.log(data)
  const rawData = data[0]?.raw_data

  return (
    <div className="App">
      {rawData && <img src={`data:image/jpeg;base64,${rawData}`}></img>}
      <br/>
      <label htmlFor="myfile">Select a file:</label>
      <input type="file" id="myfile" onChange={handleUpload} />
      {{data} && <p>{JSON.stringify(data)}</p>}

    </div>
  );
}

export default App;
