"use client";
import { AppContextType, AppProviderProps, User } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { redirect } from "next/navigation";
import { Application} from "@/types";



export const auth_service = "http://localhost:5000";
export const utils_service = "http://localhost:5001";
export const user_service = "http://localhost:5002";
export const job_service = "http://localhost:5003";

//tao context
const AppContext = createContext<AppContextType | undefined>(undefined);

//AppProvider de boc App
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  

  const token = Cookies.get("token");

  //lay thong tin user (data user)
  //cho du co thong tin user hay ko van se dat loading la false
  //tranh hien Loading component ma ko tat luon
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${user_service}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function updateProfilePic(formData: any) {
    setLoading(true);
    try {
      const {data} = await axios.put(`${user_service}/api/user/update/pic`,
        formData,
        {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        }
      );

      toast.success(data.message);
      //Chac chan cap nhat lai UI ngay khi db update xong
      //react ko tu render lai nen phai goi ham nay de re render lai UI
      fetchUser();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
    }finally {
      setLoading(false);
    }
  }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function updateResume(formData: any) {
    setLoading(true);
    try {
      const {data} = await axios.put(`${user_service}/api/user/update/resume`,
        formData,
        {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        }
      );

      toast.success(data.message);
      fetchUser();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
    }finally {
      setLoading(false);
    }
  }

  async function updateUser(name: string, phoneNumber: string, bio: string){
    setBtnLoading(true);
    try {
      const {data} = await axios.put(`${user_service}/api/user/update/profile`,
        {name, phoneNumber, bio},
        {
          headers:{
            Authorization: `Bearer ${token}`,
          }
        }
      )
      toast.success(data.message);
      fetchUser();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
    }finally{
      setBtnLoading(false);
    }
  }

  async function logOutUser() {
    Cookies.set("token", "");
    setUser(null);
    setIsAuth(false);
    toast.success("Logged out successfully");
    redirect("/");
  }
                                          //setSkill: React.Dispatch<React.SetStateAction<string>> là kiểu (type) 
                                          // của một hàm setter trong React.
                                          //const [skill, setSkill] = useState("")
                                          //setter la setSkill
  async function addSkill(skill: string, setSkill: React.Dispatch<React.SetStateAction<string>>) {
    setBtnLoading(true);
    try {
      const {data} = await axios.post(`${user_service}/api/user/skill/add`,
        //Can key cho map map.(index, i) => <key={skillName}></>
         {skillName: skill}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
         })
         toast.success(data.message);
         setSkill("");
         fetchUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
      toast.error(error.response.data.message);
    }finally{
      setBtnLoading(false);
    }
  }

  async function removeSkill(skill: string) {
    try {
      const {data} = await axios.put(`${user_service}/api/user/skill/delete`,
        //Can key cho map map.(index, i) => <key={skillName}></>
         {skillName: skill}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
         })
         toast.success(data.message);
         fetchUser();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchApplications() {
    try {
      const {data} = await axios.get(`${user_service}/api/user/application/all`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })

      setApplications(data)
    } catch (error) {
      console.log(error);
      
    }
  }

  async function applyJob(job_id: number) {
    setBtnLoading(true);
    try {                                                                 //them {} vi neu ko thi no se 
                                                                          //chi la number BE se ko hieu
      const {data} = await axios.post(`${user_service}/api/user/apply/job`, {job_id},
        {
          headers:{
          Authorization: `Bearer ${token}`
        }
      }
      )
      
      toast.success(data.message)
      fetchApplications();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
      toast.error(error.response.data.message);
    }finally{
      setBtnLoading(false);
    }
  }

  

  //useState se quyet dinh viec loading la true khi load lai trang
  //useState se reset khi reload (f5)

  //useEffect se chay lai sau useState va chay ham fetchUser
  //va finally se dat loading lai la false de dung component loading lai tranh hien hoai`
  //nhu vay moi lan reload (f5) hay lay du lieu auth hoac user deu se
  //hien Loading component
  useEffect(() => {
    fetchUser();
    fetchApplications();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        setUser,
        isAuth,
        setIsAuth,
        setLoading,
        logOutUser,
        updateProfilePic,
        updateResume,
        updateUser,
        addSkill,
        removeSkill,
        applyJob,
        applications,
        fetchApplications
        
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

//Su dung du lieu tu Provider cung cap
export const useAppData = (): AppContextType => {
  //Lấy toàn bộ dữ liệu đã được cung cấp từ AppProvider (như user, isAuth, loading, ...)
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  //Trả về dữ liệu context để dùng trong component
  return context;
};
