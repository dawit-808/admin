import { useState, useEffect, useRef } from "react";
import axios from "axios";
import classes from "./RegisterMember.module.css";

export default function RegisterMember() {
  const [formData, setFormData] = useState({
    name: "",
    trainingTypeId: "",
    paymentStatus: "unpaid",
  });
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/training-types");
        setTrainingTypes(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, trainingTypeId: res.data[0].id }));
        }
      } catch {
        setStatus((prev) => ({
          ...prev,
          error: "Failed to load training types.",
        }));
      }
    };
    fetchTrainingTypes();
  }, []);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !videoRef.current) return;
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStatus((prev) => ({ ...prev, error: null }));
    } catch (err) {
      console.warn("Camera access error:", err);
      setStatus((prev) => ({
        ...prev,
        error: "Camera access denied. Upload image instead.",
      }));
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `capture_${Date.now()}.jpg`, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        setImageFile(file);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleImageChange = (e) => {
    if (e.target.files?.length > 0) {
      setImageFile(e.target.files[0]);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      trainingTypeId: trainingTypes[0]?.id || "",
      paymentStatus: "unpaid",
    });
    setImageFile(null);
    setStatus({ loading: false, error: null, success: null });
    startCamera();
  };

  // Upload image to ImageKit
  const uploadImageToImageKit = async (file) => {
    // 1. Get authentication params from your backend
    const { data: authParams } = await axios.get(
      "http://localhost:5000/api/imagekit/auth"
    );

    // 2. Prepare form data
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("fileName", file.name);
    formDataUpload.append("signature", authParams.signature);
    formDataUpload.append("token", authParams.token);
    formDataUpload.append("expire", authParams.expire);

    // 3. Upload to ImageKit endpoint
    const uploadUrl = "https://upload.imagekit.io/api/v1/files/upload";

    const res = await axios.post(uploadUrl, formDataUpload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url; // returns the uploaded image URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    if (!formData.name || !formData.trainingTypeId) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Name and training type are required",
      }));
      return;
    }

    if (!imageFile) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Please capture or upload a profile image",
      }));
      return;
    }

    try {
      // 1. Create user on your server WITHOUT image
      const userRes = await axios.post("http://localhost:5000/users", {
        name: formData.name,
        training_type_id: formData.trainingTypeId,
        payment_status: formData.paymentStatus,
      });

      const { id: userId } = userRes.data.user;

      // 2. Upload image to ImageKit
      const imageUrl = await uploadImageToImageKit(imageFile);

      // 3. Update user profile with ImageKit URL
      await axios.put(`http://localhost:5000/users/${userId}/profile-img`, {
        profile_img_url: imageUrl,
      });

      setStatus({
        loading: false,
        error: null,
        success: "Member registered successfully!",
      });
      resetForm();
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to register member";
      setStatus((prev) => ({ ...prev, loading: false, error: errorMessage }));
    }
  };

  const handleRetakePhoto = () => {
    setImageFile(null);
    setStatus({ loading: false, error: null, success: null });
    startCamera();
  };

  return (
    <div className={classes.authWrapper}>
      <div className={classes.card}>
        <h2 className={classes.title}>Register New Member</h2>

        {status.error && (
          <div className={classes.error}>
            {/* error icon */}
            {status.error}
          </div>
        )}

        {status.success && (
          <div className={classes.success}>
            {/* success icon */}
            {status.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={classes.formGrid}>
          <div className={classes.leftColumn}>
            <div className={classes.formGroup}>
              <label htmlFor="name" className={classes.label}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                className={classes.input}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="trainingTypeId" className={classes.label}>
                Training Program
              </label>
              <select
                id="trainingTypeId"
                name="trainingTypeId"
                className={classes.input}
                value={formData.trainingTypeId}
                onChange={handleInputChange}
                required
              >
                {trainingTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.training_day} - {type.training_schedule})
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="paymentStatus" className={classes.label}>
                Payment Status
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                className={classes.input}
                value={formData.paymentStatus}
                onChange={handleInputChange}
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className={classes.hiddenFileInput}
            />

            <div className={classes.buttonGroup}>
              <button
                type="button"
                onClick={triggerFileInput}
                className={`${classes.button} ${classes.secondaryButton}`}
                disabled={status.loading}
              >
                Upload Photo
              </button>

              <button
                type="submit"
                className={classes.button}
                disabled={status.loading}
              >
                {status.loading ? "Registering..." : "Register Member"}
              </button>
            </div>
          </div>

          <div className={classes.rightColumn}>
            {!imageFile ? (
              <div className={classes.cameraSection}>
                <div className={classes.cameraWrapper}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={classes.video}
                    style={{ backgroundColor: "black" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCapture}
                  className={`${classes.button} ${classes.captureButton}`}
                >
                  Capture Photo
                </button>
              </div>
            ) : (
              <div className={classes.previewSection}>
                <h3 className={classes.previewTitle}>Profile Preview</h3>
                <div className={classes.previewWrapper}>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Member preview"
                    className={classes.previewImage}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRetakePhoto}
                  className={`${classes.button} ${classes.secondaryButton}`}
                >
                  Retake Photo
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
