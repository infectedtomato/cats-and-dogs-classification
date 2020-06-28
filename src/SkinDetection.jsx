import { h } from "preact";
import { useState } from "preact/hooks";
import * as tf from "@tensorflow/tfjs";
import useLoadSkinDetectionModel from "./hooks/useLoadSkinDetectionModel";

export default function SkinDetection() {
  const [model, pretrainedModel] = useLoadSkinDetectionModel();
  const [previewUrl, setPreviewUrl] = useState();
  const [predictionStatus, setPredictionStatus] = useState();

  function onLoadPreview(e) {
    const image = e.target.files[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(image));
    setPredictionStatus("predicting");
  }

  async function predict() {
    const img = document.querySelector("img");
    const image = tf.reshape(tf.fromPixels(img), [1, 224, 224, 3]).toFloat();
    const pretrainedModelPrediction = pretrainedModel.predict(image);
    const modelPrediction = model.predict(pretrainedModelPrediction);
    const prediction = modelPrediction.as1D().argMax().dataSync()[0];
    console.log({ prediction, modelPrediction });
  }

  if (!model) return "Loading the model...";

  return (
    <div>
      <h1>Choose image of skin</h1>
      <input type="file" onChange={onLoadPreview} accept="image/*" />
      {previewUrl &&
        <div style={{ marginTop: 10 }}>
          <img
            src={previewUrl}
            onLoad={predict}
            width={224}
            height={224}
            alt="preview"
          />
        </div>}
      {predictionStatus === "predicting" && "Predicting..."}
    </div>
  );
}