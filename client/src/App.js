import "./App.css";
import axios from "axios";
import React, { useState, useRef } from "react";
const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:4100";
const App = () => {
  const imgRef = useRef(undefined);
  const [file, setFile] = useState(undefined);
  const onChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e) => {
        imgRef.current.src = e.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFile(undefined);
      imgRef.current.src = undefined;
    }
  };
  const onClick = async () => {
    if (file) {
      const presignedURL = await getPresignedURL();
      await axios.put(presignedURL, file);
      alert("Upload Image");
    }
  };
  const getPresignedURL = async () => {
    const res = await axios.get(`${API_URL}/presigned-url-put/${file.name}`);
    return res.data;
  };
  return (
    <div className="main">
      <div className="title">Upload Image</div>
      <img alt="img" className="image" ref={imgRef} />
      <input
        className="input"
        type="file"
        id="profile"
        name="profile"
        accept="image/png, image/jpeg"
        onChange={onChange}
      />
      <button className="button" onClick={onClick}>
        업로드
      </button>
    </div>
  );
};

export default App;
