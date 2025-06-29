import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, clearMessages } from "@/redux/chatSlice";
import { api } from "@/components/utils/api";

const useGetAllMessage = () => {
  const { selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllMessage = async () => {
      if (!selectedUser?._id) return;

      dispatch(clearMessages()); // Clear previous messages immediately
      setLoading(true);

      try {
        const res = await api.post(`/message/all/${selectedUser._id}`);
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.error("Fetching messages failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMessage();
  }, [selectedUser?._id, dispatch]);

  return loading;
};

export default useGetAllMessage;
