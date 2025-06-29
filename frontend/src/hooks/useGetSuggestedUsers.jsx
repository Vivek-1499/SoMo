import { api } from '@/components/utils/api';
import { setSuggestedUsers } from '@/redux/authSlice';
import {useEffect} from 'react'
import { useDispatch } from 'react-redux'
const useGetSuggestedUsers =()=>{
  const dispatch = useDispatch();
  useEffect(()=>{
    const fetchSuggestedUsers = async () =>{
      try {
        const res =  await api.get('/user/suggested');
        if(res.data.success){
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSuggestedUsers();
  }, []);
}
export default useGetSuggestedUsers;