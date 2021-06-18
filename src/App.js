import nvision from "@nipacloud/nvision/dist/browser/nvision"
import { useState } from "react";
import { Upload, List, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import "./css/file-up.css"

require('dotenv').config();

// antd components
const { Dragger } = Upload;

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
    console.log(e)
    console.log(e.file)
    // console.log(e.target.files)
    // const res = await toBase64(e.target.files[0])
    const res = await toBase64(e.file.originFileObj)
    const imageBase64 = res.split(',')[1]
    await objectDetectionService.predict({
      rawData: imageBase64,
      outputCroppedImage: true,
      outputVisualizedImage: true,
    }).then((result) => {
      setData([result])
    });
  }
  const detectedData = data[0]?.detected_objects
  const rawData = data[0]?.raw_data
  console.log(detectedData)

  const listData = [];
  for (let i = 0; i < 23; i++) {
    listData.push({
      href: 'https://ant.design',
      title: `ant design part ${i}`,
      description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
  }

  return (
    <div className="App">
      <div className='upload-container'>
        <Dragger onChange={handleUpload} onDrop={handleUpload} showUploadList={false}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </div>
      {rawData && <img src={`data:image/jpeg;base64,${rawData}`} className="image-container"></img>}
      <br />
      <List
      className="list-container"
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={detectedData}
        renderItem={item => (
          <List.Item
            key={item.name}
            extra={
              <img
                width={272}
                alt="logo"
                src={`data:image/jpeg;base64,${item.cropped_image}`}
              />
            }
          >
            <List.Item.Meta
              title={item.name}
              description=""
            />
            {item.parent}
          </List.Item>
        )}
      />
    </div>
  );
}

export default App;
