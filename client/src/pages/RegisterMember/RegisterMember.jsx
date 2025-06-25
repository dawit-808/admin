import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./RegisterMember.module.css";

const API_BASE_URL = "http://localhost:5000";

const RegisterMember = () => {
  const navigate = useNavigate();
  // Refs
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // State
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

  // Fetch training types on mount
  useEffect(() => {
    const fetchTrainingTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-types`);
        setTrainingTypes(response.data);
        if (response.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            trainingTypeId: response.data[0].id,
          }));
        }
      } catch (error) {
        setStatus((prev) => ({
          ...prev,
          error: "Failed to load training types.",
        }));
      }
    };

    fetchTrainingTypes();
  }, []);

  // Camera setup and cleanup
  useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        error: "Camera access denied. Please upload instead.",
      }));
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Image handling
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      setImageFile(
        new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" })
      );
      stopCamera();
    });
  };

  const uploadImageToImgBB = async (file) => {
    const form = new FormData();
    form.append("image", file);

    const response = await axios.post(`${API_BASE_URL}/upload-image`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields including image
    if (!formData.name || !formData.trainingTypeId || !imageFile) {
      return setStatus({
        loading: false,
        error: "All fields including photo are required.",
        success: null,
      });
    }

    setStatus({ loading: true, error: null, success: null });

    try {
      // 1. First create the user
      const userResponse = await axios.post(`${API_BASE_URL}/users`, {
        name: formData.name,
        training_type_id: formData.trainingTypeId,
        payment_status: formData.paymentStatus,
      });
      const userId = userResponse.data.user.id;

      // 2. Then handle the image upload with proper error handling
      let imageUrl;
      try {
        imageUrl = await uploadImageToImgBB(imageFile);
      } catch (uploadError) {
        // If image upload fails, delete the user we just created
        await axios.delete(`${API_BASE_URL}/users/${userId}`);
        throw new Error("Failed to upload profile image. Please try again.");
      }

      // 3. Update user with profile image
      await axios.put(`${API_BASE_URL}/users/${userId}/profile-img`, {
        profile_img_url: imageUrl,
      });

      // Success
      setStatus({
        loading: false,
        error: null,
        success: "Member registered successfully!",
      });
      resetForm();
      navigate("/");
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || "Registration failed. Please try again.",
        success: null,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      trainingTypeId: trainingTypes[0]?.id || "",
      paymentStatus: "unpaid",
    });
    setImageFile(null);
    startCamera();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register New Member</h2>

        {/* Status messages */}
        {status.error && (
          <div className={`${styles.alert} ${styles.error}`}>
            {status.error}
          </div>
        )}
        {status.success && (
          <div className={`${styles.alert} ${styles.success}`}>
            {status.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            {/* Name Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>

            {/* Training Program */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Training Program</label>
              <select
                name="trainingTypeId"
                value={formData.trainingTypeId}
                onChange={handleInputChange}
                className={styles.input}
                required
              >
                {trainingTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.training_day} - {type.training_schedule})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Status */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={status.loading}
            >
              {status.loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Registering...
                </>
              ) : (
                "Register Member"
              )}
            </button>
          </div>

          <div className={styles.imageSection}>
            {!imageFile ? (
              <>
                <div className={styles.cameraPreview}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className={styles.video}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={handleCapture}
                    className={styles.button}
                  >
                    Capture Photo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.length > 0) {
                        setImageFile(e.target.files[0]);
                        stopCamera();
                      }
                    }}
                    className={styles.hiddenFileInput}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`${styles.button} ${styles.secondaryButton}`}
                  >
                    Upload Photo
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.imagePreview}>
                <h3 className={styles.previewTitle}>Preview</h3>
                <div className={styles.previewContainer}>
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    startCamera();
                  }}
                  className={`${styles.button} ${styles.secondaryButton}`}
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
};

export default RegisterMember;
