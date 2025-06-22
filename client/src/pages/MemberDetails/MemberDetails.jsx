import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function MemberDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching member:", err));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Member Details: {user.member_code}</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Training Type:</strong> {user.training_type}
      </p>
      <p>
        <strong>Training Day:</strong> {user.training_day}
      </p>
      <p>
        <strong>Training Schedule:</strong> {user.training_schedule}
      </p>
      <p>
        <strong>Payment Status:</strong> {user.payment_status}
      </p>
    </div>
  );
}

export default MemberDetails;
