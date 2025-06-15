import { setUserProfile } from "@/redux/authSlice"; // updated import
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/v2/user/${userId}/profile`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user)); // dispatch updated action
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch]);
};

export default useGetUserProfile;
